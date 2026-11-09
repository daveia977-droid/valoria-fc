import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const stage = "#kit-panel";
async function openViewer(page) {
  await page.goto("/");
  await page.locator(stage).scrollIntoViewIfNeeded();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "3d", { timeout: 20000 });
}

test("le GLB contient un vêtement volumétrique autonome et un dos uni", async () => {
  const buffer = readFileSync("public/models/domicile-v1.glb");
  expect(buffer.toString("utf8", 0, 4)).toBe("glTF");
  expect(buffer.readUInt32LE(4)).toBe(2);
  expect(buffer.readUInt32LE(8)).toBe(buffer.length);
  const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + buffer.readUInt32LE(12)));
  expect(gltf.meshes.length).toBeGreaterThanOrEqual(6);
  const positions = gltf.meshes.flatMap((mesh) => mesh.primitives.map((p) => gltf.accessors[p.attributes.POSITION]));
  const span = [0, 1, 2].map((i) => Math.max(...positions.map((p) => p.max[i])) - Math.min(...positions.map((p) => p.min[i])));
  expect(span[0]).toBeGreaterThan(1);
  expect(span[1]).toBeGreaterThan(1.4);
  expect(span[2]).toBeGreaterThan(0.2); // A plane or a rotated image cannot pass.
  expect(gltf.images.every((image) => image.bufferView !== undefined && !image.uri)).toBe(true);
  const back = gltf.materials.find((material) => material.name.startsWith("Bordeaux uni"));
  expect(back.pbrMetallicRoughness.baseColorTexture).toBeUndefined();
  expect(buffer.length).toBeLessThan(1_500_000);
});

test("3D intégrée à la collection, chargement différé et manipulation directe sans fenêtre", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  expect(requests.filter((url) => /\.glb|jersey-viewer|three(?:\.js|_)/.test(url))).toEqual([]);
  await expect(page.locator("#jersey-dialog, #jersey-open, #jersey-angle, [data-view]")).toHaveCount(0);
  await page.locator(stage).scrollIntoViewIfNeeded();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "3d", { timeout: 20000 });
  expect(requests.some((url) => url.endsWith("domicile-v1.glb"))).toBe(true);
  const canvas = page.locator(".jersey-canvas canvas");
  await expect(canvas).toHaveAttribute("data-engine", /three\.js/);
  const front = await canvas.screenshot();
  await page.locator(stage).focus();
  for (let i = 0; i < 12; i++) await page.keyboard.press("ArrowRight");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "180");
  expect(front.equals(await canvas.screenshot())).toBe(false);
  await page.keyboard.press("Home");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "0");
  await page.getByRole("tab", { name: /Domicile V2/ }).click();
  await expect(canvas).toHaveCount(0);
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "2d");
  await expect(page.locator("#kit-motion-note")).toHaveText("Visuel 2D");
  await page.getByRole("tab", { name: /Domicile V1/ }).click();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "3d");
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(1);
});

test("mouvement réduit : aucune rotation passive, commande manuelle toujours possible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openViewer(page);
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "0");
  await page.waitForTimeout(300);
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "0");
  await page.locator(stage).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "345");
  await expect(page.locator("#collection button")).toHaveCount(4);
});

test("perspective 2D limitée au visuel original et annulée par la pause globale", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("tab", { name: /Domicile V2/ }).click();
  const box = await page.locator(stage).boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .4);
  await expect.poll(() => page.locator(stage).evaluate((el) => el.style.getPropertyValue("--kit-tilt-y"))).not.toBe("0deg");
  const tilt = await page.locator(stage).evaluate((el) => parseFloat(el.style.getPropertyValue("--kit-tilt-y")));
  expect(Math.abs(tilt)).toBeLessThanOrEqual(4);
  await expect(page.locator("#kit-image")).toHaveAttribute("src", "/assets/collection.webp");
  await page.locator("#motion-toggle").click();
  await page.locator(stage).scrollIntoViewIfNeeded();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height * .4);
  await expect.poll(() => page.locator(stage).evaluate((el) => el.style.getPropertyValue("--kit-tilt-y"))).toBe("0deg");
  await page.getByRole("tab", { name: /Domicile V1/ }).click();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "3d", { timeout: 20000 });
  await page.locator(stage).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "15");
});

test("modèle indisponible : visuel 2D conservé et sélection des tenues opérationnelle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/models/domicile-v1.glb", (route) => route.fulfill({ status: 404, body: "unavailable" }));
  await page.goto("/");
  const response = page.waitForResponse("**/models/domicile-v1.glb");
  await page.locator(stage).scrollIntoViewIfNeeded();
  expect((await response).status()).toBe(404);
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "2d");
  await expect(page.locator("#kit-image")).toBeVisible();
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(0);
  await page.getByRole("tab", { name: /Extérieur/ }).click();
  await expect(page.locator("#kit-name")).toHaveText("Extérieur");
  await page.unroute("**/models/domicile-v1.glb");
  await openViewer(page);
});

test("absence de WebGL : quatre images accessibles, sans nouvelle interface de repli", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await page.locator(stage).scrollIntoViewIfNeeded();
  await expect(page.locator("#kit-image")).toBeVisible();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "2d");
  await expect(page.locator("#kit-motion-note")).toHaveText("Visuel 2D");
  await page.getByRole("tab", { name: /Troisième/ }).click();
  await expect(page.locator("#kit-name")).toHaveText("Troisième");
  await expect(page.locator("#collection button")).toHaveCount(4);
});

test("sélection pendant un chargement : interruption puis retour à V1 sans rendu orphelin", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  await page.route("**/models/domicile-v1.glb", async (route) => {
    await pending;
    await route.continue().catch(() => {});
  });
  await page.goto("/");
  const requested = page.waitForRequest("**/models/domicile-v1.glb");
  await page.locator(stage).scrollIntoViewIfNeeded();
  await requested;
  await page.getByRole("tab", { name: /Domicile V2/ }).click();
  release();
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(0);
  await expect(page.locator("#kit-image")).toBeVisible();
  await page.unroute("**/models/domicile-v1.glb");
  await page.getByRole("tab", { name: /Domicile V1/ }).click();
  await expect(page.locator(stage)).toHaveAttribute("data-presentation", "3d", { timeout: 20000 });
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(1);
});

for (const width of [320, 390, 768, 1440]) {
  test(`maillot en grand, rotation directe et défilement naturel à ${width}px`, async ({ browser, baseURL }) => {
    const page = await browser.newPage({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 761, reducedMotion: "reduce" });
    await openViewer(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const canvas = page.locator(".jersey-canvas canvas");
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(250);
    expect(box.height).toBeGreaterThan(350);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    if (width < 761) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + 70, y: start.y }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect(page.locator(stage)).toHaveAttribute("data-angle", "46");
      const beforeScroll = await page.evaluate(() => scrollY);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
      for (let i = 1; i <= 5; i++) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x, y: start.y - i * 20 }] });
        await page.waitForTimeout(30);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(beforeScroll + 30);
      await cdp.detach();
    } else {
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(start.x + 70, start.y, { steps: 5 });
      await page.mouse.up();
      await expect(page.locator(stage)).toHaveAttribute("data-angle", "46");
    }
    for (const name of ["Domicile V2", "Extérieur", "Troisième"]) {
      await page.getByRole("tab", { name: new RegExp(name) }).click();
      await expect(page.locator(stage)).toHaveAttribute("data-presentation", "2d");
      await expect(page.locator("#kit-image")).toBeVisible();
      const image = await page.locator(".kit-window").boundingBox();
      expect(image.x).toBeGreaterThanOrEqual(0);
      expect(image.x + image.width).toBeLessThanOrEqual(width);
      expect(image.height).toBeGreaterThan(350);
    }
    await page.close();
  });
}
