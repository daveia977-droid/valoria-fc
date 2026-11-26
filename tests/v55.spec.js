import { test, expect } from '@playwright/test';

test('V5.5 : compétition ESGCI Cup, écusson transparent et classement cohérent', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('navigation', {name:'Navigation principale'}).getByRole('link', {name:'Compétitions'})).toBeVisible();
  await expect(page.locator('#esgci-cup')).toBeVisible();
  await expect(page.locator('#cup-table-body tr')).toHaveCount(6);
  const top = page.locator('#cup-table-body tr').first();
  await expect(top).toContainText('ESGCI United');
  await expect(top.locator('.cup-points')).toHaveText('13');
  await expect(top.locator('td').last()).toHaveText('13');
  await expect(page.locator('#cup-table-body tr').nth(1)).toContainText('VALORIA FC');
  await expect(page.locator('#cup-table-body tr').nth(1).locator('.cup-points')).toHaveText('12');
  await expect(page.locator('#cup-next-opponent')).toHaveText('Horizon SC');
  await expect(page.locator('#cup-standing-round')).toHaveText('Après 5 journées');
  await expect(page.locator('#cup-recent-results li').first()).toContainText('1 : 2');
  await expect(page.locator('[data-fixture="j5"] .fixture-score')).toHaveText('2 — 1');
  await page.locator('[data-fixture="j5"]').click();
  await expect(page.locator('#ticket-purchase')).toBeHidden();
  await page.keyboard.press('Escape');
  const logo=await page.request.get('/assets/esgci-wordmark-transparent.svg');
  expect(logo.status()).toBe(200);
  const svg=await logo.text();
  expect(svg).toContain('fill-rule="evenodd"');
  expect(svg).not.toContain('fill="#fff"');
  expect(errors).toEqual([]);
});
test('V5.5 : calendrier ESGCI CUP complet', async ({page}) => {
  await page.goto('/');
  await page.locator('#cup-calendar summary').click();
  await expect(page.locator('#cup-fixtures .cup-fixture-round')).toHaveCount(10);
  await expect(page.locator('#cup-fixtures .cup-result')).toHaveCount(30);
  await expect(page.locator('#fixture-list .fixture-card')).toHaveCount(8);
});
test('V5.5 : huit articles et cinq catégories de merchandising', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
  await expect(page.locator('.shop-filter')).toHaveCount(6);
  await page.getByRole('button',{name:'Écharpes',exact:true}).click();
  await expect(page.locator('#shop-products .shop-product:visible')).toHaveCount(1);
  await expect(page.locator('#shop-result-count')).toHaveText('1 article');
  await page.getByRole('button',{name:'Maillots',exact:true}).click();
  await expect(page.locator('#shop-products .shop-product:visible')).toHaveCount(3);
  await page.getByRole('button',{name:'Tout voir',exact:true}).click();
  await expect(page.locator('#shop-products .shop-product:visible')).toHaveCount(8);
});
test('V6 : fiche produit avec prix et taille sans moyen de paiement réel',async ({page}) => {
  await page.goto('/');
  await page.locator('.shop-product-view[data-product="echarpe"]').click();
  await expect(page.locator('#shop-product-dialog')).toBeVisible();
  await expect(page.locator('#shop-dialog-title')).toHaveText('Écharpe VALORIA');
  await expect(page.locator('#shop-dialog-price')).toContainText('30');
  await expect(page.locator('#shop-product-dialog form')).toHaveCount(0);
  await expect(page.locator('#shop-dialog-quantity')).toHaveValue('1');
  await page.locator('#shop-product-dialog [data-close]').click();
  await expect(page.locator('#shop-product-dialog')).not.toBeVisible();
});
for(const width of [320,390,430,768,1440]){
  test('V5.5 : pas de débordement horizontal '+width+'px',async ({page})=>{
    await page.setViewportSize({width,height:844});
    await page.goto('/');
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('#cup-table-body tr')).toHaveCount(6);
    await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
    await expect(page.getByRole('tab')).toHaveCount(3);
  });
}
