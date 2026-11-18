import { test, expect } from '@playwright/test';

test('V7 : Third seul à la une, blason et trois maillots officiels conservés', async ({page}) => {
  const errors=[]; page.on('pageerror',err=>errors.push(err.message));
  await page.goto('/');
  await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
  await expect(page.locator('.shop-best-seller')).toHaveCount(1);
  await expect(page.locator('.shop-product:has(.shop-best-seller) h3')).toHaveText('Maillot Third');
  await expect(page.locator('#shop-products .shop-kit-frame')).toHaveCount(3);
  await expect(page.locator('.shop-card-price')).toHaveCount(8);
  await expect(page.locator('#collection .kit-tab')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('V7 : la planche 2D produit de vrais détourage alpha en navigateur', async ({page}) => {
  await page.goto('/');
  const cutout=page.locator('#shop-products .shop-kit-cutout');
  await expect.poll(()=>cutout.count(),{timeout:15000}).toBe(3);
  for(const img of await cutout.all()) {
    const result=await img.evaluate(async el=>{
      await el.decode();
      const canvas=document.createElement('canvas');
      canvas.width=el.naturalWidth; canvas.height=el.naturalHeight;
      const ctx=canvas.getContext('2d'); ctx.drawImage(el,0,0);
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let transparent=0; for(let i=3;i<pixels.length;i+=4) if(pixels[i]===0)transparent++;
      return {transparent,total:pixels.length/4};
    });
    expect(result.transparent).toBeGreaterThan(result.total*.06);
    expect(result.transparent).toBeLessThan(result.total*.95);
  }
});

test('V7 : logo ESGCI en or avec fond transparent',async ({page})=>{
  const response=await page.request.get('/assets/esgci-wordmark-transparent.svg');
  expect(response.status()).toBe(200);
  const svg=await response.text();
  expect(svg).toContain('fill="#E8C990"');
  expect(svg).not.toContain('fill="#218C54"');
  await page.goto('/');
  await expect(page.locator('.esgci-wordmark')).toHaveAttribute('src','/assets/esgci-wordmark-transparent.svg');
});

test('V7 : panier mobile, quantité, retrait et livraison à J+7',async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.locator('.shop-product-view[data-product="third"]').click();
  await page.locator('#shop-dialog-size').selectOption('XL');
  await page.locator('#shop-detail-add').click();
  await expect(page.locator('#shop-cart-dialog')).toBeVisible();
  await expect(page.locator('#shop-cart-heading-count')).toContainText('1 article');
  await expect(page.locator('.shop-cart-line')).toHaveCount(1);
  await expect(page.locator('.shop-cart-size')).toContainText('XL');
  await expect(page.locator('#shop-cart-total')).toContainText('100');
  await page.locator('.shop-cart-line [data-qty="1"]').click();
  await expect(page.locator('#shop-cart-count')).toHaveText('2');
  await expect(page.locator('#shop-cart-total')).toContainText('200');
  await page.locator('.shop-cart-line [data-qty="-1"]').click();
  await expect(page.locator('#shop-cart-total')).toContainText('100');
  const dateValue=await page.locator('#shop-delivery-date').inputValue();
  const expected=await page.evaluate(()=>{
    const today=new Date(),d=new Date(today.getFullYear(),today.getMonth(),today.getDate()+7);
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  });
  expect(dateValue).toBe(expected);
  await expect(page.locator('#shop-date-hint')).toContainText('J+7');
  await expect(page.locator('#shop-cart-summary')).toBeVisible();
  await page.locator('#shop-continue').click();
  await expect(page.locator('#shop-cart-dialog')).not.toBeVisible();
  await page.locator('#shop-cart-open').click();
  await page.locator('.shop-cart-line [data-remove]').click();
  await expect(page.locator('#shop-checkout-submit')).toBeDisabled();
});

test('V7 : confirmation de démonstration et reset du panier',async ({page})=>{
  await page.goto('/');
  await page.locator('.shop-product-view[data-product="third"]').click();
  await page.locator('#shop-dialog-size').selectOption('M');
  await page.locator('#shop-detail-add').click();
  await page.locator('#shop-checkout-submit').click();
  await expect(page.locator('#shop-confirm-dialog')).toBeVisible();
  await expect(page.locator('#shop-confirm-title')).toContainText('Notre blason');
  await expect(page.locator('#shop-confirm-total')).toContainText('100');
  await expect(page.locator('#shop-confirm-date')).not.toBeEmpty();
  await expect(page.locator('#shop-confirm-dialog')).toContainText('aucun paiement');
  await page.locator('#shop-confirm-ok').click();
  await expect(page.locator('#shop-cart-count')).toHaveText('0');
});

for(const width of [320,390,430,768,1440]){
  test('V7 : disposition sans débordement '+width+'px',async ({page})=>{
    await page.setViewportSize({width,height:844});
    await page.goto('/');
    await page.evaluate(()=>document.fonts.ready);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.locator('#shop-cart-open').click();
    const r=await page.locator('#shop-cart-dialog').boundingBox();
    expect(r.width).toBeLessThanOrEqual(width+1);
    await expect(page.locator('#shop-cart-dialog .shop-cart-close')).toBeVisible();
    await expect(page.locator('#shop-cart-summary')).toBeHidden();
  });
}
