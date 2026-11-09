import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`phase 3 : parcours local, navigation et composition à ${width}px`, async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const external = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (
        ["http:", "https:"].includes(url.protocol) &&
        url.origin !== new URL(baseURL).origin
      )
        external.push(url.origin);
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const headline = await page.locator("h1").boundingBox();
    expect(headline.x).toBeGreaterThanOrEqual(0);
    expect(headline.x + headline.width).toBeLessThanOrEqual(width);
    await page.locator("#organisation").scrollIntoViewIfNeeded();
    const header = await page.locator(".site-header").boundingBox();
    expect(header.y).toBe(0);
    if (width < 761) {
      const tree = await page.locator("#org-tree").boundingBox();
      expect(tree.height).toBeLessThan(900);
      await page.getByRole("button", { name: "Menu", exact: true }).click();
      await page
        .getByRole("navigation", { name: "Navigation mobile" })
        .getByRole("link", { name: "Le club", exact: true })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Navigation principale" })
        .getByRole("link", { name: "Le club", exact: true })
        .click();
    }
    await expect(page).toHaveURL(/#club$/);
    const sectionTop = await page
      .locator("#club")
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(sectionTop).toBeGreaterThanOrEqual(header.height);
    await expect(page.locator('.desktop-nav a[href="#club"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page.locator("#home-comparison summary").click();
    const ratios = await page
      .locator("#home-comparison img")
      .evaluateAll((images) =>
        images.map((img) => {
          const r = img.getBoundingClientRect();
          return {
            rendered: r.width / r.height,
            natural: img.naturalWidth / img.naturalHeight,
          };
        }),
      );
    ratios.forEach((r) => expect(r.rendered).toBeCloseTo(r.natural, 2));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator('#org-tree [data-person="emilie"]').click();
    await expect(page.locator("#person-role")).toHaveText(
      "Marketing et communication",
    );
    await expect(page.locator("#person-manager")).toContainText("Messi");
    await page.keyboard.press("Escape");
    await expect(page.locator("#person-dialog")).not.toBeVisible();
    expect(external).toEqual([]);
  });
}
