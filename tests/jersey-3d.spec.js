import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const stage = ".jersey-stage";
async function openViewer(page) {
  await page.goto("/");
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready", { timeout: 20000 });
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

test("chargement à la demande, vraies vues différentes, zoom, clavier et libération à la fermeture", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  expect(requests.filter((url) => /\.glb|jersey-viewer|three(?:\.js|_)/.test(url))).toEqual([]);
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready", { timeout: 20000 });
  expect(requests.some((url) => url.endsWith("domicile-v1.glb"))).toBe(true);
  const canvas = page.locator(".jersey-canvas canvas");
  await expect(canvas).toHaveAttribute("data-engine", /three\.js/);
  const front = await canvas.screenshot();
  await page.locator('[data-view="180"]').click();
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "180");
  expect(front.equals(await canvas.screenshot())).toBe(false);
  await expect(page.locator('[data-view="180"]')).toHaveAttribute("aria-pressed", "true");
  await canvas.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "195");
  await page.keyboard.press("Home");
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "0");
  await page.getByRole("button", { name: "Zoomer le maillot", exact: true }).click();
  await expect(page.locator(stage)).toHaveAttribute("data-zoom", "1.10");
  await page.getByRole("button", { name: "Réinitialiser", exact: true }).click();
  await expect(page.locator(stage)).toHaveAttribute("data-zoom", "1.00");
  await page.keyboard.press("Escape");
  await expect(page.locator("#jersey-dialog")).not.toBeVisible();
  await expect(canvas).toHaveCount(0);
  await expect(page.locator("#jersey-open")).toBeFocused();
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready");
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(1);
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "0");
});

test("rotation facultative et arrêt immédiat lors d’une préférence de mouvement réduit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openViewer(page);
  const automatic = page.locator("#jersey-auto");
  await expect(page.locator(stage)).toHaveAttribute("data-rotating", "false");
  await automatic.click();
  await expect(page.locator(stage)).toHaveAttribute("data-rotating", "true");
  await expect.poll(() => page.locator(stage).getAttribute("data-angle")).not.toBe("0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(automatic).toBeDisabled();
  await expect(automatic).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(stage)).toHaveAttribute("data-rotating", "false");
  await page.locator('[data-view="180"]').click();
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "180");
  await expect(page.locator("#jersey-motion-note")).toContainText("préférences");
});

test("la pause globale désactive aussi la rotation du maillot", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator("#motion-toggle").click();
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready", { timeout: 20000 });
  await expect(page.locator("#jersey-auto")).toBeDisabled();
  await page.locator('[data-view="90"]').click();
  await expect(page.locator(stage)).toHaveAttribute("data-angle", "90");
});

test("modèle indisponible : message, retour à la collection et nouvel essai", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/models/domicile-v1.glb", (route) => route.fulfill({ status: 404, body: "unavailable" }));
  await page.goto("/");
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "error");
  await expect(page.getByText("La présentation 2D de la collection reste disponible.")).toBeVisible();
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(0);
  await page.unroute("**/models/domicile-v1.glb");
  await page.locator("#jersey-retry").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready", { timeout: 20000 });
  await page.getByRole("button", { name: "Fermer la vue 3D" }).click();
  await page.getByRole("tab", { name: "Domicile V2" }).click();
  await expect(page.locator("#kit-name")).toHaveText("Domicile V2");
});

test("absence de WebGL : repli 2D accessible sans casser les autres fonctions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  await page.goto("/");
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "error");
  await expect(page.locator('[data-view="0"]')).toBeDisabled();
  await page.getByRole("button", { name: "Revenir à la collection" }).click();
  await page.getByRole("tab", { name: "Troisième" }).click();
  await expect(page.locator("#kit-name")).toHaveText("Troisième");
});

test("fermeture pendant un chargement : aucun rendu ni contrôle orphelin", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release;
  const pending = new Promise((resolve) => { release = resolve; });
  await page.route("**/models/domicile-v1.glb", async (route) => {
    await pending;
    await route.continue().catch(() => {});
  });
  await page.goto("/");
  const requested = page.waitForRequest("**/models/domicile-v1.glb");
  await page.locator("#jersey-open").click();
  await requested;
  await page.keyboard.press("Escape");
  release();
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(0);
  await page.unroute("**/models/domicile-v1.glb");
  await page.locator("#jersey-open").click();
  await expect(page.locator(stage)).toHaveAttribute("data-state", "ready", { timeout: 20000 });
  await expect(page.locator(".jersey-canvas canvas")).toHaveCount(1);
});

for (const width of [320, 390, 768, 1440]) {
  test(`vue 3D responsive et rotation manuelle à ${width}px`, async ({ browser, baseURL }) => {
    const page = await browser.newPage({ baseURL, viewport: { width, height: 900 }, hasTouch: width < 761, reducedMotion: "reduce" });
    await openViewer(page);
    const dialog = page.locator("#jersey-dialog");
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    const canvas = page.locator(".jersey-canvas canvas");
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(200);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    if (width < 761) {
      const cdp = await page.context().newCDPSession(page);
      const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + 70, y: start.y + 10 }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await cdp.detach();
    } else {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 10, { steps: 5 });
      await page.mouse.up();
    }
    await expect(page.locator(stage)).toHaveAttribute("data-angle", "42");
    await page.locator('[data-view="180"]').click();
    await expect(page.locator(stage)).toHaveAttribute("data-angle", "180");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await page.close();
  });
}
