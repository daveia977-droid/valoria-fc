import { test, expect } from '@playwright/test';

test('calendrier V2 : huit rencontres et grande affiche', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
  await expect(page.locator('#featured-opponent')).toContainText('BARCELONE');
  await expect(page.locator('#supporters')).toContainText('10 200');
  await expect(page.locator('.scene .textile')).toHaveAttribute('src', '/assets/stade-valoria-v25.webp');
  expect(errors).toEqual([]);
});

test('le match passé ne permet pas d’enregistrer un billet', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-fixture="j1"]').click();
  await expect(page.locator('#dialog-result')).toContainText('2 — 0');
  await expect(page.locator('#ticket-purchase')).toBeHidden();
  await page.keyboard.press('Escape');
});

test('match futur, tribune, quantité, specimen et OK', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-fixture="j5"]').click();
  await expect(page.locator('#ticket-purchase')).toBeVisible();
  await page.locator('#ticket-tribune').selectOption('A');
  await page.locator('#ticket-quantity').selectOption('2');
  await expect(page.locator('#ticket-price')).toHaveText('220 €');
  await expect(page.locator('.ticket-watermark')).toContainText('SPÉCIMEN');
  await page.getByRole('button', { name: 'Enregistrer mon billet' }).click();
  await expect(page.locator('#ticket-confirmation-title')).toHaveText('Votre billet est enregistré.');
  await expect(page.locator('#ticket-purchase')).toBeHidden();
  await page.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.locator('#match-dialog')).not.toBeVisible();
});

for (const width of [320, 390, 768, 1440]) {
  test('V2 adaptative sans débordement à ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
    await expect(page.getByRole('tab')).toHaveCount(3);
  });
}
