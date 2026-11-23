import {test,expect} from '@playwright/test';

test('V8.2 — no generic diagonal CTAs; links keep their targets',async ({page})=>{
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 const offenders=await page.locator('main').evaluate(el=>[...el.querySelectorAll('a,button')].filter(x=>x.textContent?.includes('↗')).length);
 expect(offenders).toBe(0);
 await expect(page.locator('#campagne a[href="#boutique"]')).toBeAttached();
 await expect(page.locator('#campagne a[href="#shop-catalogue"]')).toBeAttached();
 await expect(page.locator('.competitions-links .link-end-mark')).toHaveCount(2);
 await expect(page.locator('.campaign-v8-lead .link-end-mark')).toHaveCount(1);
 await expect(page.locator('.campaign-v8-bottom .link-end-mark')).toHaveCount(1);
 expect(errors).toEqual([]);
});

test('V8.2 — supporter metric and disclosure in privacy',async ({page})=>{
 await page.goto('/');
 const counter=page.locator('.supporters-figure strong');
 await expect(counter).toHaveText('13 542');
 const size=await counter.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
 expect(size).toBeGreaterThanOrEqual(64);
 await expect(page.locator('#supporters')).not.toContainText('fictif');
 await page.goto('/confidentialite.html');
 await expect(page.locator('[aria-labelledby="legal-supporters"]')).toContainText('13 542');
 await expect(page.locator('[aria-labelledby="legal-supporters"]')).toContainText('ne provient pas d’un compteur de comptes');
});

test('V8.2 — hero motion scoped only to the scene',async ({page})=>{
 await page.goto('/');
 await page.evaluate(()=>window.scrollTo(0,Math.max(100,innerHeight/2)));
 await expect.poll(async()=>page.locator('.scene').evaluate(el=>el.style.getPropertyValue('--p'))).not.toBe('');
 const values=await page.evaluate(()=>({scene:document.querySelector('.scene').style.getPropertyValue('--p'),root:document.documentElement.style.getPropertyValue('--p')}));
 expect(Number(values.scene)).toBeGreaterThan(0);
 expect(values.root).toBe('');
});

for(const width of [320,390,430,768,1440]){
 test('V8.2 — layout '+width+'px without overflow',async ({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/');
  const measure=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth,followers:document.querySelector('.supporters-figure strong').getBoundingClientRect().toJSON(),parent:document.querySelector('.supporters-figure').getBoundingClientRect().toJSON()}));
  expect(measure.scrollWidth).toBeLessThanOrEqual(measure.innerWidth+1);
  expect(measure.followers.width).toBeLessThanOrEqual(measure.parent.width);
  await page.locator('#campagne').scrollIntoViewIfNeeded();
  const campaign=await page.locator('.campaign-v8-card').first().evaluate(el=>({h:el.getBoundingClientRect().height,im:el.querySelector('img').naturalWidth}));
  expect(campaign.h).toBeGreaterThan(250);
  expect(campaign.im).toBeGreaterThan(800);
 });
}

test('V8.2 — reduced motion, shop and campaign intact',async ({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await expect(page.locator('html')).toHaveClass(/static-motion/);
 await expect(page.locator('.supporters-figure strong')).toHaveText('13 542');
 await page.locator('#campaign-v8-next').click();
 await expect(page.locator('#campaign-v8-current')).toHaveText('02');
 await expect(page.locator('#shop-products .shop-product')).toHaveCount(8);
});
