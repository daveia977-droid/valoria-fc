import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
for (const width of [320, 390, 768, 1440]) {
  test(`pages légales et liens du site à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const [file, title] of [['mentions-legales', 'Mentions légales'], ['confidentialite', 'Confidentialité'], ['cgu', 'Conditions d’utilisation']]) {
      const response = await page.goto(`/${file}.html`);
      expect(response.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (file === 'mentions-legales') {
        await expect(page.locator('main')).toContainText('France');
        await expect(page.locator('main')).toContainText('Informations non communiquées');
      }
      await page.getByRole('link', { name: 'Retour au site', exact: true }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('VALORIA FC');
    }
  });
}
test('accessibilité des pages légales, sans stockage applicatif', async ({ page }) => {
  for (const file of ['mentions-legales', 'confidentialite', 'cgu']) {
    await page.goto(`/${file}.html`);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })));
    expect(violations).toEqual([]);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    expect(await page.context().cookies()).toEqual([]);
  }
});
