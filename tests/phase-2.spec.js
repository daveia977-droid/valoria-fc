import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

for (const width of [390, 1440]) {
  test(`organigramme : hiérarchie, fiches et clavier à ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const tree = page.locator("#club-people");
    await expect(tree.locator(".person-button")).toHaveCount(7);
    expect(await tree.locator('.leadership-list [data-person]').evaluateAll(nodes => nodes.map(n => n.dataset.person))).toEqual(['yvan', 'messi']);
    const poles = tree.locator('.poles-list > li');
    expect(await poles.count()).toBe(3);
    expect(await poles.nth(0).locator('[data-person]').evaluateAll(nodes => nodes.map(n => n.dataset.person))).toEqual(['charel', 'marco']);
    expect(await poles.nth(1).locator('[data-person]').evaluateAll(nodes => nodes.map(n => n.dataset.person))).toEqual(['mamady', 'dylan']);
    expect(await poles.nth(2).locator('[data-person]').evaluateAll(nodes => nodes.map(n => n.dataset.person))).toEqual(['emilie']);

    const charel = tree.locator('[data-person="charel"]');
    await charel.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Charel", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("#person-role")).toHaveText(
      "Finances et transferts",
    );
    await expect(dialog.locator("#person-manager")).toContainText("Messi");
    await dialog
      .locator("#person-reports")
      .getByRole("button", { name: /Marco/ })
      .click();
    await expect(page.locator("#person-name")).toHaveText("Marco");
    await expect(page.locator("#person-role")).toHaveText("Comptabilité");
    await expect(page.locator("#person-empty")).toBeVisible();
    await page
      .locator("#person-manager")
      .getByRole("button", { name: /Charel/ })
      .click();
    await expect(page.locator("#person-name")).toHaveText("Charel");
    await page.keyboard.press("Escape");
    await expect(page.locator("#person-dialog")).not.toBeVisible();
    await expect(charel).toBeFocused();

    for (const [id, name, role] of [
      ["yvan", "Yvan", "Président"],
      ["messi", "Messi", "Directeur général"],
      ["mamady", "Mamady", "Logistique et commerce"],
      ["dylan", "Dylan", "Équipements"],
      ["emilie", "Émilie", "Marketing et communication"],
    ]) {
      await tree.locator(`[data-person="${id}"]`).click();
      await expect(page.locator("#person-name")).toHaveText(name);
      await expect(page.locator("#person-role")).toHaveText(role);
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Fermer", exact: true })
        .click();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test(`collection V2 : trois tenues et sponsor à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('tab')).toHaveCount(3);
    await expect(page.locator('#home-comparison')).toHaveCount(0);
    await page.getByRole('tab', { name: 'Domicile', exact: true }).click();
    await expect(page.locator('#kit-name')).toHaveText('Domicile');
    await expect(page.locator('.kit-sponsor')).toHaveText('NW$');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("défilement réversible : le blason et les textes retrouvent leur pose", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1700);
    const scroll = async (top) => {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        top,
      );
      await page.waitForTimeout(100);
    };
    const crest = () =>
      page
        .locator(".emblem")
        .evaluate((el) => getComputedStyle(el).transform);
    await scroll(180);
    const initial = await crest();
    await scroll(360);
    expect(await crest()).not.toBe(initial);
    await scroll(180);
    expect(await crest()).toBe(initial);
    await scroll(0);
    const original = await crest();
    await scroll((await page.locator('.story').evaluate(el => el.offsetHeight)) - 900);
    await expect(page.locator('.identity')).toHaveAttribute('aria-hidden', 'false');
    expect(await page.locator('.identity').evaluate(el => Number(getComputedStyle(el).opacity))).toBe(1);
    await scroll(0);
    expect(await crest()).toBe(original);

  }
});

test("mouvement réduit pendant une fiche : arrêt de toutes les animations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator('#club-people [data-person="messi"]').click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  // MediaQueryList change is asynchronous; verify it applied before closing the modal.
  await expect(page.locator("#pause")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.getAnimations().filter((a) => a.playState === "running")
            .length,
      ),
    )
    .toBe(0);
  await expect(page.locator("#person-dialog")).toBeVisible();
  await expect(page.locator("#person-name")).toHaveText("Messi");
  await page.keyboard.press("Escape");
  await expect(page.locator(".emblem")).toHaveCSS("transform", "none");
});

test("accessibilité de la comparaison et de la fiche d’organisation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#home-comparison summary").click();
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const check = async () => {
    const result = await page.evaluate(() =>
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
    );
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  };
  await check();
  await page.locator('#club-people [data-person="messi"]').click();
  await check();
});
