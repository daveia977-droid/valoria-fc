// Exercise the actual production build at the GitHub Pages project subpath.
// No remote services, mocks of assets, or changes to the displayed site.
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const port = process.env.PAGES_PREVIEW_PORT || "4175";
const origin = `http://127.0.0.1:${port}`;
const base = "/valoria-fc/";
const output = "artifacts/github-pages";
mkdirSync(output, { recursive: true });
assert(existsSync("dist/index.html"), "Run npm run build before npm run test:pages");
const html = readFileSync("dist/index.html", "utf8");
assert(html.includes(`${base}assets/`), "The build must use the GitHub Pages base");
assert(!/(?:src|href)=["']\/(?:assets|src)\//.test(html), "A root-only asset URL remains");
assert(!existsSync("dist/design") && !existsSync("dist/src") && !existsSync("dist/.git"));

let serverLog = "";
const server = spawn(process.execPath, [resolve("node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", port, "--strictPort"], { stdio: ["ignore", "pipe", "pipe"] });
server.stdout.on("data", (chunk) => { serverLog += chunk; });
server.stderr.on("data", (chunk) => { serverLog += chunk; });
let browser;
const report = { base, origin, publicFiles: [], viewports: [], errors: [], externalRequests: [] };
function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview exited: ${serverLog}`);
    try {
      const response = await fetch(`${origin}${base}`);
      if (response.ok) { ready = true; break; }
    } catch { /* Wait for the local server. */ }
    await delay(250);
  }
  assert(ready, `Preview did not start: ${serverLog}`);

  // Verify every supplied public resource, including the real GLB and notices.
  for (const path of filesIn("public")) {
    const relative = path.slice("public/".length).replaceAll("\\", "/");
    const response = await fetch(`${origin}${base}${relative}`);
    assert.equal(response.status, 200, relative);
    assert.equal((await response.arrayBuffer()).byteLength, statSync(path).size, relative);
    report.publicFiles.push(relative);
  }

  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  for (const width of [320, 390, 768, 1440]) {
    const mobile = width < 761;
    const page = await browser.newPage({ viewport: { width, height: mobile ? 844 : 1000 }, hasTouch: mobile, reducedMotion: width === 1440 ? "no-preference" : "reduce" });
    const requested = [];
    page.on("pageerror", (error) => report.errors.push(error.message));
    page.on("request", (request) => {
      const url = new URL(request.url());
      requested.push(url.href);
      if (["https:", "http:"].includes(url.protocol) && url.origin !== origin)
        report.externalRequests.push(url.href);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
    });
    page.on("requestfailed", (request) => {
      // Aborting an unused V1 fetch on a tab switch/offscreen is intentional.
      if (!(request.url().endsWith(".glb") && request.failure()?.errorText.includes("ABORTED")))
        report.errors.push(`${request.failure()?.errorText} ${request.url()}`);
    });
    await page.goto(`${origin}${base}`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal((await page.locator("h1").innerText()).replace(/\s+/g, " ").trim(), "VALORIA FC");
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((a) => a.getAttribute("href")).filter((href) => href.length > 1 && !document.getElementById(href.slice(1))));
    assert.deepEqual(brokenAnchors, []);
    assert(!requested.some((url) => url.endsWith(".glb") || /jersey-viewer-.*\.js/.test(url)), "Three.js and GLB must remain lazy");

    if (width === 1440) {
      const crest = page.locator(".hero-crest img");
      const pose = await crest.evaluate((el) => getComputedStyle(el).transform);
      await delay(300);
      assert.notEqual(await crest.evaluate((el) => getComputedStyle(el).transform), pose, "Hero motion must work in production");
      await page.locator("#motion-toggle").click();
      const paused = await crest.evaluate((el) => getComputedStyle(el).transform);
      await delay(250);
      assert.equal(await crest.evaluate((el) => getComputedStyle(el).transform), paused);
    }
    await page.getByRole("link", { name: "Découvrir le club" }).click();
    assert.equal(new URL(page.url()).pathname, base);
    assert.equal(new URL(page.url()).hash, "#club");
    const modelResponse = page.waitForResponse(`${origin}${base}models/domicile-v1.glb`);
    await page.locator("#kit-panel").scrollIntoViewIfNeeded();
    const model = await modelResponse;
    assert.equal(model.status(), 200);
    assert.equal((await model.body()).byteLength, statSync("public/models/domicile-v1.glb").size);
    await page.locator('#kit-panel[data-presentation="3d"]').waitFor({ timeout: 20000 });
    assert(await page.locator(".jersey-canvas canvas").getAttribute("data-engine"));
    await page.locator("#kit-panel").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#kit-panel").getAttribute("data-angle"), "15");
    await page.keyboard.press("Home");

    if (mobile) {
      const cdp = await page.context().newCDPSession(page);
      const box = await page.locator(".jersey-canvas canvas").boundingBox();
      const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + 70, y: start.y }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForFunction(() => document.querySelector("#kit-panel").dataset.angle === "46");
      const initialScroll = await page.evaluate(() => scrollY);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
      for (let step = 1; step <= 5; step++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x, y: start.y - step * 20 }] });
        await delay(35);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForFunction((y) => scrollY > y + 30, initialScroll);
      await cdp.detach();
    }
    for (const [index, name] of ["Domicile V1", "Domicile V2", "Extérieur", "Troisième"].entries()) {
      if (!index) continue;
      await page.getByRole("tab", { name: new RegExp(name) }).click();
      assert.equal(await page.locator("#kit-name").innerText(), name);
      assert.equal(await page.locator("#kit-panel").getAttribute("data-presentation"), "2d");
      assert.equal(await page.locator("#kit-image").getAttribute("src"), `${base}assets/collection.webp`);
    }
    await page.locator("#home-comparison summary").click();
    assert.equal(await page.locator("#home-comparison img").count(), 2);
    await page.locator('[data-person="charel"]').click();
    assert.equal(await page.locator("#person-name").innerText(), "Charel");
    assert((await page.locator("#person-manager").innerText()).includes("Messi"));
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#org-tree .org-person").count(), 7);
    await page.locator("#contact-open").click();
    await page.getByLabel("Votre nom", { exact: true }).fill("Test Pages");
    await page.getByLabel("Votre e-mail").fill("pages@example.com");
    await page.getByLabel("Votre message", { exact: true }).fill("Contrôle local de compilation.");
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Télécharger mon brouillon" }).click();
    assert.equal((await download).suggestedFilename(), "message-valoria-fc.txt");
    await page.keyboard.press("Escape");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const missingImages = await page.locator("img").evaluateAll((images) => images.filter((img) => !img.complete || !img.naturalWidth).map((img) => img.src));
    assert.deepEqual(missingImages, []);
    await page.locator("#kit-panel").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/preview-${width}.jpg`, type: "jpeg", quality: 88 });
    report.viewports.push({ width, noOverflow: true, imagesLoaded: true, realGlbLoaded: true, lazyThree: true, organisation: true, draftDownload: true, nativeTouchScroll: mobile });
    await page.close();
  }
  assert.deepEqual(report.externalRequests, []);
  assert.deepEqual(report.errors, []);
  report.status = "passed";
  writeFileSync(`${output}/preview-report.json`, JSON.stringify(report, null, 2));
  console.log(`Pages preview passed at ${base}: ${report.viewports.length} viewports, ${report.publicFiles.length} public resources, GLB, fonts, motion, touch, organisation and draft. No missing resources or blocking JS errors.`);
} catch (error) {
  report.status = "failed";
  report.failure = error.message;
  writeFileSync(`${output}/preview-report.json`, JSON.stringify(report, null, 2));
  throw error;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  writeFileSync(`${output}/preview-server.log`, serverLog);
}
