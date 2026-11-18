import { test, expect } from '@playwright/test';

test('V3.5 : huit écussons originaux disponibles avec un blason VALORIA inchangé', async ({ page }) => {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/');
  await expect(page.locator('#fixture-list .fixture-own-crest')).toHaveCount(8);
  await expect(page.locator('#fixture-list .opponent-crest')).toHaveCount(8);
  const urls = await page.locator('#fixture-list .opponent-crest').evaluateAll(imgs => imgs.map(img => img.getAttribute('src')));
  expect(new Set(urls).size).toBe(8);
  for (const url of urls) {
    const response = await page.request.get(url);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('svg');
  }
  await expect(page.locator('#featured-crest')).toHaveAttribute('src', '/assets/opponents/barca.svg');
  await expect(page.locator('#featured-crest')).toHaveAttribute('alt', /non officiel/);
  await expect(page.locator('.emblem img')).toHaveAttribute('src', '/assets/crest.webp');
  expect(errors).toEqual([]);
});

test('V3.5 : les fiches de match affichent deux écussons dans le bon ordre', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-fixture="j2"]').click();
  await expect(page.locator('#match-dialog')).toBeVisible();
  await expect(page.locator('#dialog-opponent-crest')).toHaveAttribute('src', '/assets/opponents/juventus.svg');
  await expect(page.locator('.match-dialog-badges')).toHaveClass(/is-away/);
  await page.keyboard.press('Escape');
  await page.locator('[data-fixture="j5"]').click();
  await expect(page.locator('#dialog-opponent-crest')).toHaveAttribute('src', '/assets/opponents/barca.svg');
  await expect(page.locator('.match-dialog-badges')).not.toHaveClass(/is-away/);
  await page.locator('#ticket-tribune').selectOption('A');
  await page.locator('#ticket-quantity').selectOption('2');
  await expect(page.locator('#ticket-total-label')).toContainText('220');
  await expect(page.locator('.ticket-watermark')).toContainText('NON VALABLE');
});

test('V3.5 : les icônes utilisent toutes le même langage et les boutons fonctionnent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.editorial-arrow .ui-icon')).toHaveCount(4);
  await expect(page.locator('#fixture-previous .ui-icon')).toHaveCount(1);
  await expect(page.locator('#fixture-next .ui-icon')).toHaveCount(1);
  await expect(page.locator('#menu-open .ui-icon')).toHaveCount(1);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#mobile-menu [data-close]').click();
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
  await expect(page.locator('#pause')).toHaveAttribute('aria-pressed', 'true');
});

for (const width of [320, 390, 430, 768, 1440]) {
  test('V3.5 : aucune régression de largeur à ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('tab')).toHaveCount(3);
    await expect(page.locator('#club-people [data-person]')).toHaveCount(7);
    await expect(page.locator('#boutique-title')).toContainText('à venir');
  });
}
