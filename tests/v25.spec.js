import { test, expect } from '@playwright/test';

test('V2.5 : accueil dégagé, photographie de stade validée', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.scene .textile')).toHaveAttribute('src', '/assets/stade-valoria-v25.webp');
  await expect(page.locator('.scene .stadium-decoration')).toHaveCount(0);
  await expect(page.locator('.scene')).not.toContainText('Club fictif');
  await expect(page.locator('.scene')).not.toContainText('Projet personnel');
  await expect(page.locator('#matchs')).toBeVisible();
  await expect(page.locator('#supporters')).toContainText('13 542');
  const photo = await page.locator('.scene .textile').evaluate(async image => {
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(photo).toEqual({ width: 480, height: 600 });
});

test('V2.5 : sponsor typographique NW$ sur trois maillots de face', async ({ page }) => {
  await page.goto('/');
  for (const [index, name] of ['Domicile', 'Extérieur', 'Third'].entries()) {
    await page.getByRole('tab', { name, exact: true }).click();
    const panel = page.locator('#kit-panel');
    await expect(panel).toHaveAttribute('data-kit', String(index));
    await expect(panel).toHaveAttribute('data-presentation', '2d');
    await expect(page.locator('#kit-name')).toHaveText(name);
    await expect(page.locator('.kit-sponsor text')).toHaveText('NW$');
    await expect(page.locator('.kit-sponsor path')).toHaveCount(1);
    const style = await page.locator('.kit-sponsor').evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, color: getComputedStyle(el).color };
    });
    expect(style.width).toBeGreaterThan(80);
    expect(style.color).toMatch(/^rgb/);
  }
});

for (const width of [320, 390, 768, 1440]) {
  test('V2.5 : sans débordement en ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
    const decorated = await page.locator('.supporters-section').evaluate(el => getComputedStyle(el).backgroundImage);
    expect(decorated).toContain('stade-valoria-v25.webp');
  });
}

test('V2.5 : informations légales accessibles avec atmosphère cohérente', async ({ page }) => {
  for (const path of ['/mentions-legales.html', '/confidentialite.html', '/cgu.html']) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.locator('.legal-main')).toBeVisible();
    const background = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundImage);
    expect(background).toContain('stade-valoria-v25.webp');
  }
  await page.goto('/mentions-legales.html');
  await expect(page.locator('.legal-main')).toContainText('Projet personnel');
  await expect(page.locator('.legal-main')).toContainText('Club fictif');
});

test('V2.5 : préférences de mouvement respectées', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#pause')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.scene .textile')).toHaveCSS('transform', 'none');
});
