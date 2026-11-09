import { chromium } from '@playwright/test';
import { mkdirSync, existsSync } from 'node:fs';
const output = 'artifacts/correction-collection';
mkdirSync(`${output}/frames`, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] });
const url = process.env.COLLECTION_PREVIEW_URL || 'http://127.0.0.1:4174/';
const errors = [];
for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 761 });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#kit-panel').scrollIntoViewIfNeeded();
  await page.locator('#kit-panel[data-presentation="3d"]').waitFor();
  await page.evaluate((mobile) => {
    const target = document.querySelector(mobile ? '.kit-layout' : '#collection');
    const y = target.getBoundingClientRect().top + scrollY;
    const header = document.querySelector('.site-header').getBoundingClientRect().height;
    window.scrollTo(0, mobile ? y - header - 20 : y + 20);
  }, width < 761);
  await page.screenshot({path:`${output}/${name}.jpg`,type:'jpeg',quality:93});
  for (const kit of [1,2,3]) {
    await page.locator(`[data-kit="${kit}"]`).click();
    await page.screenshot({path:`${output}/${name}-maillot-${kit+1}.jpg`,type:'jpeg',quality:91});
  }
  await page.close();
}
const page = await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
await page.goto(url);
await page.locator('#kit-panel').scrollIntoViewIfNeeded();
await page.locator('#kit-panel[data-presentation="3d"]').waitFor();
await page.evaluate(() => window.scrollTo(0, document.querySelector('.kit-layout').getBoundingClientRect().top + scrollY - 130));
const box = await page.locator('.jersey-canvas').boundingBox();
let index = 0;
const frame = () => page.screenshot({path:`${output}/frames/f${String(index++).padStart(3,'0')}.jpg`,type:'jpeg',quality:86});
for (let i=0;i<6;i++) await frame();
// Two actual pointer drags turn the existing mesh through a full revolution.
for (let pass=0;pass<2;pass++) {
  const distance = 180/.65;
  const x = box.x + (box.width - distance)/2;
  const y = box.y + box.height*.48;
  await page.mouse.move(x,y);
  await page.mouse.down();
  for (let i=1;i<=30;i++) {
    await page.mouse.move(x+distance*i/30,y);
    await frame();
  }
  await page.mouse.up();
}
await page.locator('[data-kit="1"]').click();
await page.emulateMedia({reducedMotion:'no-preference'});
for (let i=0;i<24;i++) {
  await page.mouse.move(box.x+box.width*(.1+.8*i/23),box.y+box.height*.4);
  await frame();
}
await browser.close();
if(errors.length) throw new Error(errors.join('\n'));
console.log(`Captured desktop/mobile, four unchanged garments and ${index} demonstration frames; no page errors.`);
