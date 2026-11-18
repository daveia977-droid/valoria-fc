import { test, expect } from '@playwright/test';

test('V3.2 : accueil épuré, blason intact et nouvelle histoire du club', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-action, .scene-caption')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Voir les matchs' })).toHaveCount(0);
  await expect(page.locator('.emblem img')).toHaveAttribute('src', '/assets/crest.webp');
  await expect(page.locator('.club-story')).toContainText('2026');
  await expect(page.locator('.club-story')).toContainText('jeunes ambitieux');
  await expect(page.locator('#club-story-title')).toContainText('Une histoire à');
});

test('V3.2 : entrée Boutique, annonce à venir, aucune vente effective', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Navigation principale' })
    .getByRole('link', { name: 'Boutique' }).click();
  await expect(page).toHaveURL(/#boutique$/);
  await expect(page.locator('#boutique-title')).toContainText('Boutique officielle');
  await expect(page.locator('#boutique-title')).toContainText('VALORIA');
  await expect(page.locator('.boutique-v55-state')).toContainText('Sans paiement réel');
  await expect(page.locator('#boutique .shop-filter')).toHaveCount(6);
  await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
  await expect(page.locator('#boutique form, #boutique input, #boutique [type="submit"]')).toHaveCount(0);
  await page.locator('.boutique-v55-link').click();
  await expect(page).toHaveURL(/#shop-catalogue$/);
});

test('V3.2 : affichage mobile et menu avec boutique et histoire', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const navigation = page.getByRole('navigation', { name: 'Navigation mobile' });
  await expect(navigation.getByRole('link', { name: 'Le club' })).toBeVisible();
  await navigation.getByRole('link', { name: 'Boutique' }).click();
  await expect(page.locator('#mobile-menu')).not.toBeVisible();
  await expect(page).toHaveURL(/#boutique$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('V3.5 : orga inchangée, vrai blason du club et emblèmes graphiques originaux', async ({ page }) => {
  await page.goto('/');
  const people = await page.locator('#club-people .person-button').evaluateAll(nodes => nodes.map(el => el.dataset.person));
  expect(people).toEqual(['yvan', 'messi', 'charel', 'marco', 'mamady', 'dylan', 'emilie']);
  await expect(page.locator('#fixture-list .fixture-own-crest')).toHaveCount(8);
  await expect(page.locator('#fixture-list .opponent-crest')).toHaveCount(8);
  await expect(page.locator('#fixture-list .club-mark')).toHaveCount(0);
  await expect(page.locator('.organisation-editorial')).toBeVisible();
});

test('V3.2 : billet spécimen et calendrier toujours disponibles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
  await page.locator('[data-fixture="j5"]').click();
  await page.locator('#ticket-tribune').selectOption('A');
  await page.locator('#ticket-quantity').selectOption('2');
  await expect(page.locator('#ticket-total-label')).toContainText('220');
  await expect(page.locator('.ticket-watermark')).toContainText('NON VALABLE');
  await page.getByRole('button', { name: 'Enregistrer mon billet' }).click();
  await expect(page.locator('#ticket-confirmation-title')).toContainText('enregistré');
});

for (const width of [320, 390, 430, 768, 1440]) {
  test('V3.2 sans débordement horizontal sur ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('#club')).toBeVisible();
    await expect(page.locator('#boutique')).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(3);
  });
}

test('V3.2 : informations de future commercialisation, aucune transaction', async ({ page }) => {
  await page.goto('/mentions-legales.html');
  await expect(page.locator('.legal-main')).toContainText('future boutique');
  await expect(page.locator('.legal-main')).toContainText('aucune vente');
  await page.goto('/cgu.html');
  await expect(page.locator('.legal-main')).toContainText('simulation locale');
  await expect(page.locator('.legal-main')).toContainText('aucun achat');
});
