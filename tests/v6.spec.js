import { test, expect } from '@playwright/test';

test('V6 : photographie merch, maillots détachés du fond et tarifs indicatifs', async ({ page }) => {
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
 await expect(page.locator('#shop-products .shop-product-photo')).toHaveCount(5);
 await expect(page.locator('#shop-products .shop-kit-frame')).toHaveCount(3);
 await expect(page.locator('.shop-card-price')).toHaveCount(8);
 await expect(page.locator('.shop-card-price').first()).toContainText('100');
 const img=await page.request.get('/assets/shop/merch-photography-v6.webp');
 expect(img.status()).toBe(200);
 expect(img.headers()['content-type']).toMatch(/image\/webp/);
 await expect(page.locator('#boutique')).toContainText('Sans paiement réel');
 expect(errors).toEqual([]);
});

test('V6 : panier fonctionnel, taille, quantités, date et confirmation démo', async ({page})=>{
 await page.goto('/');
 await page.locator('.shop-product-view[data-product="domicile"]').click();
 await expect(page.locator('#shop-product-dialog')).toBeVisible();
 await page.locator('#shop-dialog-size').selectOption('L');
 await page.locator('#shop-dialog-quantity').fill('2');
 await page.locator('#shop-detail-add').click();
 await expect(page.locator('#shop-product-dialog')).not.toBeVisible();
 await expect(page.locator('#shop-cart-dialog')).toBeVisible();
 await expect(page.locator('#shop-cart-count')).toHaveText('2');
 await expect(page.locator('#shop-cart-total')).toContainText('200');
 await expect(page.locator('#shop-cart-lines .shop-cart-line')).toHaveCount(1);
 const delivery=page.locator('#shop-delivery-date');
 await expect(delivery).toHaveAttribute('type','hidden');
 await expect(delivery).toHaveValue(/^\d{4}-\d{2}-\d{2}$/);
 await expect(page.locator('#shop-date-hint')).toContainText('J+7');
 await page.locator('#shop-checkout-submit').click();
 await expect(page.locator('#shop-confirm-dialog')).toBeVisible();
 await expect(page.locator('#shop-confirm-total')).toContainText('200');
 await expect(page.locator('#shop-confirm-dialog')).toContainText('aucune commande');
 await page.locator('#shop-confirm-ok').click();
 await expect(page.locator('#shop-confirm-dialog')).not.toBeVisible();
 await expect(page.locator('#shop-cart-count')).toHaveText('0');
});

test('V6 : filtres et retrait du panier, jamais de débit', async ({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Gants',exact:true}).click();
 await expect(page.locator('#shop-products .shop-product:visible')).toHaveCount(1);
 await page.locator('.shop-product-view[data-product="gants"]').click();
 await page.locator('#shop-dialog-size').selectOption('M');
 await page.locator('#shop-detail-add').click();
 await expect(page.locator('#shop-cart-total')).toContainText('30');
 await page.locator('#shop-cart-lines [data-remove]').click();
 await expect(page.locator('#shop-checkout-submit')).toBeDisabled();
 await expect(page.locator('#shop-cart-lines')).toContainText('vide');
 await expect(page.locator('#shop-cart-dialog')).toContainText('Aucun paiement');
});

test('V6 : panier conservé pendant la session navigateur', async ({page})=>{
 await page.goto('/');
 await page.locator('.shop-product-view[data-product="echarpe"]').click();
 await page.locator('#shop-detail-add').click();
 await page.locator('#shop-cart-dialog [data-close]').click();
 await page.reload();
 await expect(page.locator('#shop-cart-count')).toHaveText('1');
 await page.locator('#shop-cart-open').click();
 await expect(page.locator('#shop-cart-lines .shop-cart-line')).toHaveCount(1);
});

test('V6 : textes légaux du checkout simulé', async ({page})=>{
 await page.goto('/confidentialite.html');
 await expect(page.locator('.legal-main')).toContainText('sessionStorage');
 await expect(page.locator('.legal-main')).toContainText('Aucune commande réelle');
 await page.goto('/cgu.html');
 await expect(page.locator('.legal-main')).toContainText('prix contractuels');
});

for (const width of [320,390,430,768,1440]) {
 test('V6 : catalogue et panier mobiles sans débordement '+width+'px',async ({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
  await page.locator('#shop-cart-open').click();
  await expect(page.locator('#shop-cart-dialog')).toBeVisible();
  const dialog=await page.locator('#shop-cart-dialog').boundingBox();
  expect(dialog.width).toBeLessThanOrEqual(width);
 });
}
