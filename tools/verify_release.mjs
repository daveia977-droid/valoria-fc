// Check the compiled or actually published site. No mock assets or remote services.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const url = process.env.VALORIA_SITE_URL || 'http://127.0.0.1:4188/';
const dir = process.env.VALORIA_REPORT_DIR || 'artifacts/v1-final';
mkdirSync(dir, { recursive: true });
const report = { url, status: 'running', viewports: [], screenshots: [], errors: [], missing: [], modelRequests: [], resources: [] };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'], ...(url.startsWith('https:') && process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}) });
const settle = async page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
async function screenshot(page, id, name, fullChapter = false) {
  const old = page.viewportSize();
  await page.evaluate(() => document.activeElement?.blur()); await page.mouse.move(0, 0);
  if (fullChapter) {
    for (let i = 0; i < 3; i++) {
      const height = Math.ceil(await page.locator(id).evaluate(el => el.offsetHeight));
      if (height <= page.viewportSize().height) break;
      await page.setViewportSize({ width: old.width, height }); await settle(page);
    }
  }
  if (id) await page.locator(id).evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
  await page.waitForTimeout(750);
  await page.screenshot({ path: `${dir}/${name}.png` });
  report.screenshots.push({ name, viewport: page.viewportSize() });
  if (fullChapter) await page.setViewportSize(old);
}
try {
  const versionUrl = new URL('version.json', url).href;
  if (url.startsWith('https:')) {
    // curl honours the managed environment's proxy and CA settings.
    report.version = JSON.parse(execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '20', versionUrl], { encoding: 'utf8' }));
  } else {
    const versionResponse = await fetch(versionUrl);
    assert.equal(versionResponse.status, 200);
    report.version = await versionResponse.json();
  }
  if (process.env.VALORIA_EXPECTED_COMMIT) assert.equal(report.version.commit, process.env.VALORIA_EXPECTED_COMMIT);
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 320 ? 568 : width === 390 ? 844 : 900 }, hasTouch: width < 761 });
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.missing.push(`${response.status()} ${response.url()}`); if (response.url().startsWith(new URL(url).origin)) report.resources.push(response.url()); });
    page.on('request', request => { if (/\.glb|jersey-viewer|three(?:\.|_|-)/.test(request.url())) report.modelRequests.push(request.url()); });
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }); assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1500);
    assert.equal((await page.locator('h1').innerText()).trim(), 'VALORIA FC');
    const title = await page.locator('h1').boundingBox(), crest = await page.locator('.emblem img').boundingBox();
    assert(title.y + title.height <= crest.y + 1, 'Initial title must remain above the crest');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if ([390, 1440].includes(width)) await screenshot(page, null, `hero-${width}`);
    await page.evaluate(() => scrollTo({ top: document.querySelector('.story').offsetHeight - document.querySelector('.scene').offsetHeight, behavior: 'instant' }));
    await settle(page); assert.equal(await page.locator('.identity').getAttribute('aria-hidden'), 'false');
    if ([390, 1440].includes(width)) await screenshot(page, null, `identite-${width}`);
    if ([390, 1440].includes(width)) await screenshot(page, '#collection', `collection-${width}`, true);
    for (const [i, name] of ['Domicile V1', 'Domicile V2', 'Extérieur', 'Third'].entries()) {
      await page.getByRole('tab', { name, exact: true }).click();
      assert.equal(await page.locator('#kit-name').innerText(), name);
      assert.equal(await page.locator('#kit-panel').getAttribute('data-presentation'), '2d');
      if (width === 1440) await screenshot(page, '#collection', `maillot-${i}-1440`, true);
    }
    assert.equal(await page.locator('[data-view], #kit-back-state, #collection canvas').count(), 0);
    if ([390, 1440].includes(width)) await screenshot(page, '#organisation', `organisation-${width}`, true);
    for (const id of ['yvan', 'messi', 'charel', 'marco', 'mamady', 'dylan', 'emilie']) {
      await page.locator(`#club-people [data-person="${id}"]`).click();
      assert(await page.locator('#person-dialog').evaluate(el => el.open));
      await page.keyboard.press('Escape');
    }
    const links = await page.locator('a[href^="#"]').evaluateAll(nodes => nodes.map(el => el.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(href.slice(1)))); assert.deepEqual(links, []);
    for (const file of ['mentions-legales', 'confidentialite', 'cgu']) {
      const legal = new URL(`${file}.html`, url).href;
      const response = await page.goto(legal, { waitUntil: 'networkidle' }); assert.equal(response.status(), 200);
      assert.equal(await page.locator('h1').count(), 1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (file === 'mentions-legales' && width === 390) await page.screenshot({ path: `${dir}/mentions-legales-390.png` });
    }
    report.viewports.push({ width, hero: true, collection2d: 4, organisationProfiles: 7, legalPages: 3, overflow: false });
    await page.close();
  }
  assert.deepEqual(report.errors, []); assert.deepEqual(report.missing, []); assert.deepEqual(report.modelRequests, []);
  report.resources = [...new Set(report.resources)]; report.status = 'passed';
} catch (error) { report.status = 'failed'; report.failure = error.message; throw error; }
finally { writeFileSync(`${dir}/release-verification.json`, JSON.stringify(report, null, 2)); console.log(JSON.stringify({ url, status: report.status, viewports: report.viewports.length, errors: report.errors, missing: report.missing, failure: report.failure }, null, 2)); await browser.close(); }
