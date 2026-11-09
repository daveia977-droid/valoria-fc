import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

test("navigation, collection accessible et brouillon local", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "VALORIA FC",
  );
  await page.getByRole("link", { name: "Découvrir le club" }).click();
  await expect(page).toHaveURL(/#identite$/);
  await page.getByRole("tab", { name: /Domicile V2/ }).click();
  await expect(page.locator("#kit-name")).toHaveText("Domicile V2");
  await page.getByRole("tab", { name: /Domicile V2/ }).press("End");
  await expect(page.getByRole("tab", { name: /Third/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#kit-image")).toHaveAttribute(
    "alt",
    /sans sponsor/,
  );
  await page.getByRole("button", { name: "Préparer un message" }).click();
  await page.getByLabel("Votre nom", { exact: true }).fill("Supporter Valoria");
  await page.getByLabel("Votre e-mail").fill("supporter@example.com");
  await page
    .getByLabel("Votre message", { exact: true })
    .fill("Une question sur le projet pédagogique.");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger mon brouillon" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("message-valoria-fc.txt");
  await expect(page.locator("#form-status")).toContainText(
    "Aucun message n’a été envoyé",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#contact-dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("mouvement visible, pause et préférences système", async ({ page }) => {
  await page.goto("/");
  const position = () =>
    page
      .locator(".crest-reveal")
      .evaluate((el) => getComputedStyle(el).transform);
  const first = await position();
  await page.waitForTimeout(250);
  expect(await position()).not.toBe(first);
  await page
    .getByRole("button", { name: "Mettre en pause les animations" })
    .click();
  const stopped = await position();
  await page.waitForTimeout(250);
  expect(await position()).toBe(stopped);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("#pause")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const running = await page.evaluate(
    () =>
      document.getAnimations().filter((a) => a.playState === "running").length,
  );
  expect(running).toBe(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`mise en page ${width}px et absence de débordement`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width < 761) {
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await expect(
        page.getByRole("dialog", { name: "VALORIA FC" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Navigation mobile" })
        .getByRole("link", { name: "Collection" })
        .click();
      await expect(page.locator("#mobile-menu")).not.toBeVisible();
      await expect(page).toHaveURL(/#collection$/);
    }
    // Validate even intentionally deferred images, without mistaking lazy loading for a broken URL.
    await page.locator("img").evaluateAll(async images => {
      images.forEach(image => { image.loading = "eager"; });
      await Promise.allSettled(images.map(image => image.decode()));
    });
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
      );
    expect(broken).toEqual([]);
  });
}

test("accessibilité automatisée des états principaux", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const check = async () => {
    const results = await page.evaluate(() =>
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
    );
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  };
  await check();
  await page.getByRole("button", { name: "Préparer un message" }).click();
  await check();
});
