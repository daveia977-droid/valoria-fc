import { test, expect } from '@playwright/test';

test('V8 — campaign is between collection and boutique', async ({page}) => {
  const errors=[];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const order=await page.locator('main > section[id]').evaluateAll(sections=>sections.map(section=>section.id));
  expect(order.indexOf('campagne')).toBe(order.indexOf('collection')+1);
  expect(order.indexOf('boutique')).toBe(order.indexOf('campagne')+1);
  await expect(page.locator('.campaign-v8-card')).toHaveCount(5);
  await expect(page.locator('.campaign-v8-card img')).toHaveCount(5);
  await expect(page.locator('.campaign-v8-bottom')).toContainText('modèles fictifs générés avec');
  await expect(page.locator('.campaign-v8-bottom')).toContainText('produit fabriqué');
  await expect(page.locator('#campaign-v8-title')).toContainText('Partout.');
  await expect(page.locator('.desktop-nav a[href="#campagne"]')).toHaveCount(1);
  await expect(page.locator('#mobile-menu a[href="#campagne"]')).toHaveCount(1);
  await expect(page.locator('.collection-onward')).toHaveAttribute('href','#campagne');
  expect(errors).toEqual([]);
});

test('V8 — four original local campaign WebP photographs load', async ({page}) => {
  await page.goto('/#campagne');
  const images=page.locator('.campaign-v8-card:not(:last-child) img');
  for (const element of await images.all()) {
    const src=await element.getAttribute('src');
    expect(src).toMatch(/^\/assets\/campaign\/[\w-]+-v8(?:3)?\.webp$/);
    const response=await page.request.get(src);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toMatch(/webp/i);
    const info=await element.evaluate(async img => {
      if (!img.complete) await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});
      return [img.naturalWidth,img.naturalHeight];
    });
    expect(info[0]).toBeGreaterThan(800);
    expect(info[1]).toBeGreaterThan(1000);
  }
});

test('V8 — manual five-image mobile gallery and no autoplay', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#campagne');
  const rail=page.locator('#campaign-v8-rail');
  await expect(page.locator('#campaign-v8-prev')).toBeDisabled();
  await expect(page.locator('#campaign-v8-current')).toHaveText('01');
  await page.locator('#campaign-v8-next').click();
  await expect.poll(async()=>await rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(80);
  await expect(page.locator('#campaign-v8-current')).toHaveText('02');
  await page.locator('#campaign-v8-prev').click();
  await expect.poll(async()=>await rail.evaluate(el=>el.scrollLeft)).toBeLessThan(35);
  await expect(page.locator('#campaign-v8-current')).toHaveText('01');
  await expect(page.locator('#campaign-v8-prev')).toBeDisabled();
  await page.waitForTimeout(250);
  await expect(page.locator('#campaign-v8-current')).toHaveText('01');
});

for (const width of [320,390,430,768,1440]) {
  test('V8 — responsive '+width+'px with no page overflow', async ({page}) => {
    await page.setViewportSize({width,height:820});
    await page.goto('/');
    await expect(page.locator('#campagne')).toBeAttached();
    const view=await page.evaluate(()=>({
      documentWidth:document.documentElement.scrollWidth,
      viewportWidth:innerWidth,
      cards:document.querySelectorAll('#campagne figure').length,
      galleryWidth:document.getElementById('campaign-v8-rail').clientWidth,
    }));
    expect(view.documentWidth).toBeLessThanOrEqual(view.viewportWidth+1);
    expect(view.cards).toBe(5);
    expect(view.galleryWidth).toBeGreaterThan(0);
    if(width<=760)await expect(page.locator('.campaign-v8-controls')).toBeVisible();
  });
}

test('V8 — reduced motion, shirt tabs and shop intact',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#campagne');
  await page.locator('#campaign-v8-next').click();
  await expect(page.locator('#campaign-v8-current')).toHaveText('02');
  await page.locator('#kit-tab-1').click();
  await expect(page.locator('#kit-name')).toHaveText('Extérieur');
  await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
  await expect(page.locator('#shop-cart-open')).toBeAttached();
});



test('V8.1 — Safari-safe mobile cards have explicit nonzero layout sizes', async ({page}) => {
  for (const width of [320,375,390,430]) {
    await page.setViewportSize({width,height:844});
    await page.goto('/#campagne');
    const gallery=await page.locator('.campaign-v8-rail').evaluate(rail=>({
      display:getComputedStyle(rail).display,
      cards:[...rail.querySelectorAll('.campaign-v8-card')].map(card=>({
        height:card.getBoundingClientRect().height,
        width:card.getBoundingClientRect().width,
        imageNaturalWidth:card.querySelector('img').naturalWidth,
        imagePosition:getComputedStyle(card.querySelector('img')).position,
      }))
    }));
    expect(gallery.display).toBe('flex');
    expect(gallery.cards).toHaveLength(5);
    expect(gallery.cards.every(card=>card.height>=330&&card.width>200)).toBe(true);
    expect(gallery.cards[0].imageNaturalWidth).toBeGreaterThan(800);
  }
});

test('V8.1 — mobile gallery remains visible without JS, user-supplied photo order',async ({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('/');
  const cards=page.locator('.campaign-v8-card');
  await expect(cards).toHaveCount(5);
  const images=await cards.locator('img').evaluateAll(list=>list.map(img=>img.getAttribute('src')));
  expect(images).toEqual([
   '/assets/campaign/training-night-v83.webp',
   '/assets/campaign/studio-femme-v8.webp',
   '/assets/campaign/studio-homme-v8.webp',
   '/assets/campaign/street-duo-v8.webp',
   'https://d2ol7oe51mr4n9.cloudfront.net/user_3MU2YkLzO9ZeuERIymS9UYipWBe/56c4ef88-5394-4838-84fb-640d72f73ad3.jpg',
  ]);
  expect(await cards.first().evaluate(c=>c.getBoundingClientRect().height)).toBeGreaterThan(330);
  await context.close();
});


test('V8.3 — training portrait is first and optimized without enlarging gallery',async ({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#campagne');
 const images=page.locator('.campaign-v8-card img');
 await expect(images).toHaveCount(5);
 await expect(images.first()).toHaveAttribute('src','/assets/campaign/training-night-v83.webp');
 const response=await page.request.get('/assets/campaign/training-night-v83.webp');
 expect(response.ok()).toBe(true);
 expect((await response.body()).length).toBeLessThan(210000);
 await expect(page.locator('.campaign-v8-card').first()).toContainText('Sous les projecteurs.');
 await expect(page.locator('.campaign-v8-bottom')).toContainText('personne réelle');
 await page.locator('#campaign-v8-next').click();
 await expect(page.locator('#campaign-v8-current')).toHaveText('02');
});


test('V8.4 — fifth street portrait is appended and navigation reaches it',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#campagne');
  const cards=page.locator('.campaign-v8-card');
  await expect(cards).toHaveCount(5);
  await expect(cards.nth(4).locator('img')).toHaveAttribute('src', 'https://d2ol7oe51mr4n9.cloudfront.net/user_3MU2YkLzO9ZeuERIymS9UYipWBe/56c4ef88-5394-4838-84fb-640d72f73ad3.jpg');
  await expect(cards.nth(4)).toContainText('Street · Extérieur');
  for (let i=0;i<4;i++) await page.locator('#campaign-v8-next').click();
  await expect(page.locator('#campaign-v8-current')).toHaveText('05');
  await expect(page.locator('#campaign-v8-next')).toBeDisabled();
});
