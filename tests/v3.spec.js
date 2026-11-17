import { test, expect } from '@playwright/test';

test('V3 : accès direct aux rencontres depuis la scène, sans supprimer le blason', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('VALORIA FC');
  await expect(page.locator('.scene .crest-reveal img')).toHaveAttribute('src', '/assets/crest.webp');
  await page.getByRole('link', { name: /Voir les matchs/ }).click();
  await expect(page).toHaveURL(/#matchs$/);
  await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
  expect(errors).toEqual([]);
});

test('V3 : résultats visibles et ordre domicile / déplacement', async ({ page }) => {
  await page.goto('/');
  const winner = page.locator('.fixture-card[data-fixture="j1"]');
  await expect(winner).toHaveClass(/result-win/);
  await expect(winner.locator('.fixture-result-label')).toContainText('VICTOIRE');
  await expect(winner.locator('.fixture-score')).toHaveText('2 — 0');
  const away = page.locator('.fixture-card[data-fixture="j2"]');
  await expect(away).toHaveClass(/result-loss/);
  await expect(away.locator('.fixture-result-label')).toContainText('DÉFAITE');
  await expect(away.locator('.fixture-score')).toHaveText('2 — 1');
  await expect(away.locator('.fixture-team').first()).toContainText('Juventus');
  await expect(page.locator('.fixture-card[data-fixture="j3"]')).toHaveClass(/result-draw/);
});

test('V3 : ticket spécimen, total indicatif et fermeture au clavier', async ({ page }) => {
  await page.goto('/');
  await page.locator('.fixture-card[data-fixture="j5"]').click();
  await expect(page.locator('#ticket-purchase')).toBeVisible();
  await expect(page.locator('#ticket-location')).toContainText('domicile');
  await page.locator('#ticket-tribune').selectOption('A');
  await page.locator('#ticket-quantity').selectOption('2');
  await expect(page.locator('#ticket-total-label')).toContainText('220');
  await expect(page.locator('#ticket-price')).toContainText('220');
  await expect(page.locator('.ticket-watermark')).toContainText('NON VALABLE');
  await page.getByRole('button', { name: 'Enregistrer mon billet' }).click();
  await expect(page.locator('#ticket-confirmation-title')).toHaveText('Votre billet est enregistré.');
  await page.keyboard.press('Escape');
  await expect(page.locator('#match-dialog')).not.toBeVisible();
});

test('V3 : onglet actif sur le calendrier et les supporters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('#matchs').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.desktop-nav a[href="#matchs"]').getAttribute('aria-current')).toBe('location');
  await page.locator('#supporters').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.desktop-nav a[href="#supporters"]').getAttribute('aria-current')).toBe('location');
  await expect(page.locator('.supporters-values span')).toHaveText(['Ferveur', 'Unité', 'Respect']);
});

for (const width of [320, 390, 430, 768, 1440]) {
  test('V3 : aucun débordement du document à ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.kit-tab')).toHaveCount(3);
    await expect(page.locator('.kit-sponsor text')).toHaveText('NW$');
    await expect(page.locator('.fixture-card')).toHaveCount(8);
  });
}

test('V3 : préférences de mouvement réduit et cibles tactiles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#pause')).toHaveAttribute('aria-pressed', 'true');
  const box = await page.getByRole('link', { name: /Voir les matchs/ }).boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('.scene .textile')).toHaveCSS('transform', 'none');
});
