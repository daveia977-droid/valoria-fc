import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const origin = 'http://127.0.0.1:4187';
const dir = 'artifacts/collection-organisation';
const viewports = [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 844, height: 390 }];
const kitNames = ['Domicile V1', 'Domicile V2', 'Extérieur', 'Third'];
const people = {
  yvan: { name: 'Yvan', role: 'Président', manager: null, reports: ['messi'] },
  messi: { name: 'Messi', role: 'Directeur général', manager: 'yvan', reports: ['charel', 'mamady', 'emilie'] },
  charel: { name: 'Charel', role: 'Finances et transferts', manager: 'messi', reports: ['marco'] },
  marco: { name: 'Marco', role: 'Comptabilité', manager: 'charel', reports: [] },
  mamady: { name: 'Mamady', role: 'Logistique et commerce', manager: 'messi', reports: ['dylan'] },
  dylan: { name: 'Dylan', role: 'Équipements', manager: 'mamady', reports: [] },
  emilie: { name: 'Émilie', role: 'Marketing et communication', manager: 'messi', reports: [] },
};
const result = { status: 'running', viewports: [], screenshots: [], a11y: [], videos: [], pageErrors: [], badResponses: [], outsideRequests: [], prohibitedRequests: [], webglContexts: [] };
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
let currentPage;

async function instrument(page, label) {
  page.on('pageerror', error => result.pageErrors.push({ label, message: error.message }));
  page.on('response', response => { if (response.status() >= 400) result.badResponses.push({ label, url: response.url(), status: response.status() }); });
  page.on('request', request => {
    const url = new URL(request.url());
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== origin) result.outsideRequests.push({ label, url: url.href });
    if (/\.(?:glb|gltf)(?:$|\?)/i.test(url.href) || /(?:^|\/)three(?:[.-]|\/)/i.test(url.pathname)) result.prohibitedRequests.push({ label, url: url.href });
  });
  await page.addInitScript(() => {
    window.__webglContexts = [];
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (/webgl/i.test(String(type))) window.__webglContexts.push(type);
      return original.call(this, type, ...args);
    };
  });
}

async function settle(page, milliseconds = 0) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  if (milliseconds) await page.waitForTimeout(milliseconds);
}

async function visitSection(page, id) {
  await page.locator(id).evaluate(node => node.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await settle(page, 600);
}

async function noOverflow(page, label) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: horizontal overflow`);
}

// Capture a real, neutral viewport at the requested width, tall enough for the chapter.
// Locator screenshots may centre a tall section and place the fixed navigation halfway down it.
async function chapterScreenshot(page, selector, name) {
  const originalViewport = page.viewportSize();
  const originalScroll = await page.evaluate(() => scrollY);
  const section = page.locator(selector);
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(0, 0);
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const height = Math.ceil(Math.max(originalViewport.height, await section.evaluate(node => node.offsetHeight)));
      if (page.viewportSize().height === height) break;
      await page.setViewportSize({ width: originalViewport.width, height });
      await page.evaluate(() => document.fonts.ready);
      await settle(page, 100);
    }
    const sectionHeight = await section.evaluate(node => node.offsetHeight);
    assert(sectionHeight <= page.viewportSize().height + 1, `${name}: chapter height did not stabilise`);
    await section.evaluate(node => scrollTo({ top: node.offsetTop, behavior: 'instant' }));
    await page.evaluate(() => document.fonts.ready);
    await settle(page, 650);
    await page.screenshot({ path: `${dir}/${name}.png` });
    result.screenshots.push({ name: `${name}.png`, section: selector, viewport: page.viewportSize(), sectionHeight, method: 'Actual viewport capture; chapter aligned at top; viewport temporarily extended vertically; navigation and styles unchanged' });
  } finally {
    await page.setViewportSize(originalViewport);
    await page.evaluate(value => scrollTo({ top: value, behavior: 'instant' }), originalScroll);
    await settle(page, 100);
  }
}

async function axeAudit(page, viewport, state) {
  if (![390, 1440].includes(viewport.width)) return;
  const violations = await page.evaluate(async () => {
    const audit = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
    return audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }));
  });
  result.a11y.push({ ...viewport, state, violations });
  assert.deepEqual(violations, [], `${viewport.width}: ${state} accessibility audit`);
}

async function selectedKit(page, index) {
  const tabs = page.getByRole('tablist', { name: 'Choisir une tenue', exact: true }).getByRole('tab');
  assert.equal(await tabs.count(), 4);
  assert.equal(await tabs.evaluateAll(nodes => nodes.filter(node => node.getAttribute('aria-selected') === 'true').length), 1, 'Exactly one selected kit');
  for (let i = 0; i < kitNames.length; i++) {
    assert.equal(await tabs.nth(i).getAttribute('aria-selected'), String(i === index));
    assert.equal(await tabs.nth(i).getAttribute('tabindex'), i === index ? '0' : '-1');
  }
  assert((await page.locator('#kit-name').textContent()).includes(kitNames[index]));
  assert((await page.locator('#kit-announcement').textContent()).includes(kitNames[index]), 'Live announcement identifies the selected kit');
}

async function verifyTabs(page, viewport) {
  const list = page.getByRole('tablist', { name: 'Choisir une tenue', exact: true });
  const tabs = list.getByRole('tab');
  for (let index = 0; index < kitNames.length; index++) {
    const tab = tabs.nth(index);
    assert.equal(await tab.getAttribute('data-kit'), String(index));
    assert.equal((await tab.textContent()).trim(), kitNames[index]);
    const metrics = await tab.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width, height: rect.height, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth };
    });
    assert(metrics.left >= -1 && metrics.right <= viewport.width + 1 && metrics.height >= 44 && metrics.width >= 44, `Tab target does not fit: ${JSON.stringify(metrics)}`);
    assert(metrics.scrollWidth <= metrics.clientWidth + 1, `${kitNames[index]} label is clipped`);
  }
  assert.equal(await page.locator('#kit-panel').getAttribute('role'), 'tabpanel');
  const status = page.locator('#kit-announcement');
  assert((await status.getAttribute('role')) === 'status' || ['polite', 'assertive'].includes(await status.getAttribute('aria-live')), 'Selection status must be announced');
  await tabs.nth(0).focus();
  for (const [key, index] of [['ArrowRight', 1], ['End', 3], ['ArrowRight', 0], ['ArrowLeft', 3], ['Home', 0]]) {
    await page.keyboard.press(key);
    await selectedKit(page, index);
    assert(await tabs.nth(index).evaluate(node => node === document.activeElement), `${key} must move tab focus`);
  }
  // Several selections in one task must cancel stale transitions, leaving the last selection authoritative.
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('[role="tab"][data-kit]');
    for (const index of [2, 0, 3, 1, 2, 3]) tabs[index].click();
  });
  await selectedKit(page, 3);
  await settle(page, 650);
  await selectedKit(page, 3);
}

async function verifyCollection(page, viewport) {
  const saved = [390, 1440].includes(viewport.width);
  const tabs = page.getByRole('tablist', { name: 'Choisir une tenue', exact: true }).getByRole('tab');
  await visitSection(page, '#collection');
  await noOverflow(page, `${viewport.width}: collection`);
  await verifyTabs(page, viewport);
  for (let index = 0; index < kitNames.length; index++) {
    await tabs.nth(index).click();
    await page.locator('[data-view="face"]').click();
    await selectedKit(page, index);
    await settle(page, 650);
    assert.equal(await page.locator('[data-view="face"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-view="back"]').getAttribute('aria-pressed'), 'false');
    assert(await page.locator('.kit-viewport').isVisible());
    assert.equal(await page.locator('#kit-back-state').isVisible(), false);
    const atlas = await page.locator('.kit-viewport img').evaluate(image => ({ src: image.currentSrc, complete: image.complete, width: image.naturalWidth, height: image.naturalHeight }));
    assert(atlas.complete && atlas.width === 1832 && atlas.height === 859 && new URL(atlas.src).pathname.endsWith('/assets/collection.webp'), `Must use the original face atlas: ${JSON.stringify(atlas)}`);
    if (viewport.width === 1440) await chapterScreenshot(page, '#collection', `kit-face-${index}-1440`);
    if (index === 0 && saved) await chapterScreenshot(page, '#collection', `collection-${viewport.width}`);
    await page.locator('[data-view="back"]').click();
    assert.equal(await page.locator('[data-view="back"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('[data-view="face"]').getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('.kit-viewport').isVisible(), false, 'Unavailable backs must not display an invented image');
    assert(await page.locator('#kit-back-state').isVisible());
    const message = (await page.locator('#kit-back-state').textContent()).trim();
    assert(message.length > 12 && /dos|arrière/i.test(message), 'Unavailable back requires an explicit explanation');
    if (index === 0 && saved) await chapterScreenshot(page, '#collection', `collection-back-unavailable-${viewport.width}`);
  }
  assert.equal(await page.locator('#collection canvas, #collection model-viewer').count(), 0);
  await tabs.nth(0).click();
  await page.locator('[data-view="face"]').click();
  await settle(page, 650);
  await axeAudit(page, viewport, 'collection-face');
}

async function dialogProfile(page, id) {
  const person = people[id];
  assert(await page.locator('#org-person-dialog').evaluate(node => node.open));
  assert.equal((await page.locator('#org-person-name').textContent()).trim(), person.name);
  assert.equal((await page.locator('#org-person-role').textContent()).trim(), person.role);
  assert((await page.locator('#org-person-description').textContent()).trim().length > 10);
  const managerIds = await page.locator('#org-person-manager [data-org-person]').evaluateAll(nodes => nodes.map(node => node.dataset.orgPerson));
  assert.deepEqual(managerIds, person.manager ? [person.manager] : []);
  const reports = await page.locator('#org-person-reports [data-org-person]').evaluateAll(nodes => nodes.map(node => node.dataset.orgPerson));
  assert.deepEqual(reports, person.reports);
  assert.equal(await page.locator('#org-person-empty').isVisible(), person.reports.length === 0);
}

async function closeAndReturn(page, opener, method) {
  if (method === 'escape') await page.keyboard.press('Escape');
  else if (method === 'button') await page.locator('[data-org-close]').click();
  else {
    const rect = await page.locator('#org-person-dialog').boundingBox();
    const viewport = page.viewportSize();
    let point;
    if (rect.x > 1) point = { x: 1, y: Math.max(1, viewport.height / 2) };
    else if (rect.y > 1) point = { x: viewport.width / 2, y: 1 };
    else if (rect.x + rect.width < viewport.width - 1) point = { x: viewport.width - 1, y: viewport.height / 2 };
    assert(point, 'Dialog must expose a backdrop area for this dismissal test');
    await page.mouse.click(point.x, point.y);
  }
  await page.waitForFunction(() => !document.querySelector('#org-person-dialog').open);
  assert(await opener.evaluate(node => document.activeElement === node), `${method}: focus must return to the original tree opener`);
}

async function verifyOrganisation(page, viewport) {
  await visitSection(page, '#organisation');
  await noOverflow(page, `${viewport.width}: organisation`);
  const nodes = page.locator('.org-tree [data-org-person]');
  assert.equal(await nodes.count(), 7);
  const actual = await nodes.evaluateAll(buttons => buttons.map(button => {
    const item = button.closest('li');
    const parentItem = item?.parentElement.closest('li');
    const parent = parentItem?.querySelector('[data-org-person]');
    return { id: button.dataset.orgPerson, name: button.querySelector('strong')?.textContent.trim(), role: button.querySelector('.org-node-role')?.textContent.trim(), manager: parent?.dataset.orgPerson || null };
  }));
  assert.deepEqual(actual, Object.entries(people).map(([id, person]) => ({ id, name: person.name, role: person.role, manager: person.manager })), 'Names, roles, and semantic nesting must preserve the exact official hierarchy');
  for (const node of await nodes.all()) {
    const bounds = await node.boundingBox();
    assert(bounds && bounds.x >= -1 && bounds.x + bounds.width <= viewport.width + 1 && bounds.height >= 44, 'All organisation targets must fit and remain touchable');
  }
  if ([390, 1440].includes(viewport.width)) await chapterScreenshot(page, '#organisation', `organisation-${viewport.width}`);
  await axeAudit(page, viewport, 'organisation');
  const opener = page.locator('.org-tree [data-org-person="yvan"]');
  await opener.click();
  await settle(page, 350);
  await dialogProfile(page, 'yvan');
  await axeAudit(page, viewport, 'dialog');
  if ([390, 1440].includes(viewport.width)) await page.locator('#org-person-dialog').screenshot({ path: `${dir}/organisation-dialog-${viewport.width}.png` });
  // Traverse both direct reports and a manager without resetting the original opener.
  for (const [container, id] of [['#org-person-reports', 'messi'], ['#org-person-reports', 'charel'], ['#org-person-reports', 'marco'], ['#org-person-manager', 'charel']]) {
    await page.locator(`${container} [data-org-person="${id}"]`).click();
    await dialogProfile(page, id);
  }
  await closeAndReturn(page, opener, 'escape');
  const mamady = page.locator('.org-tree [data-org-person="mamady"]');
  await mamady.click();
  await dialogProfile(page, 'mamady');
  await closeAndReturn(page, mamady, 'backdrop');
  const emilie = page.locator('.org-tree [data-org-person="emilie"]');
  await emilie.focus();
  await page.keyboard.press('Enter');
  await dialogProfile(page, 'emilie');
  await closeAndReturn(page, emilie, 'button');
}

async function touchScroll(page) {
  await visitSection(page, '#collection');
  const before = await page.evaluate(() => scrollY);
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 690 }] });
  for (let index = 1; index <= 8; index++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 690 - index * 48 }] });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(start => scrollY > start + 20, before);
  await session.detach();
  await page.waitForTimeout(450);
}

async function recordScroll(viewport, name) {
  const frames = `${dir}/frames-${name}`;
  mkdirSync(frames, { recursive: true });
  const page = await browser.newPage({ viewport, hasTouch: name === 'mobile', reducedMotion: 'no-preference' });
  await instrument(page, `video-${name}`);
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await settle(page, 1500);
  const positions = await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const story = document.querySelector('.story'), scene = document.querySelector('.scene');
    const maximum = document.documentElement.scrollHeight - innerHeight;
    return [story.offsetTop + (story.offsetHeight - scene.offsetHeight) * .94, Math.min(maximum, document.querySelector('#collection').offsetTop - 85), Math.min(maximum, document.querySelector('#organisation').offsetTop - 85)];
  });
  let index = 0;
  const capture = async y => {
    await page.evaluate(value => scrollTo(0, value), y);
    await settle(page);
    await page.screenshot({ path: `${frames}/f${String(index++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 90 });
  };
  const hold = async y => { for (let i = 0; i < 6; i++) await capture(y); };
  const travel = async (from, to, count) => {
    for (let i = 1; i <= count; i++) {
      const p = i / count, eased = p * p * (3 - 2 * p);
      await capture(from + (to - from) * eased);
    }
  };
  await hold(positions[0]); await travel(positions[0], positions[1], 27);
  await hold(positions[1]); await travel(positions[1], positions[2], 27);
  await hold(positions[2]); await travel(positions[2], positions[0], 42); await hold(positions[0]);
  result.videos.push({ name, viewport, frames: index, fps: 12, durationSeconds: index / 12, framePattern: `${frames}/f%03d.jpg`, method: 'Browser-rendered native scroll positions: identity, collection, organisation, then reverse; encoded separately with ffmpeg' });
  result.webglContexts.push(...await page.evaluate(() => window.__webglContexts));
  await page.close();
}

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport, hasTouch: viewport.width < 761 || viewport.height < 500, reducedMotion: 'no-preference' });
    currentPage = page;
    await instrument(page, `${viewport.width}x${viewport.height}`);
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    await settle(page, 1500);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    await verifyCollection(page, viewport);
    await verifyOrganisation(page, viewport);
    if (viewport.width === 390) await touchScroll(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settle(page, 100);
    await visitSection(page, '#collection');
    await page.getByRole('tab', { name: 'Third', exact: true }).click();
    await selectedKit(page, 3);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(item => item.playState === 'running').length), 0, 'Reduced motion must leave no running animations');
    await axeAudit(page, viewport, 'reduced-collection');
    await visitSection(page, '#organisation');
    await page.locator('.org-tree [data-org-person="messi"]').click();
    await dialogProfile(page, 'messi');
    assert.equal(await page.evaluate(() => document.getAnimations().filter(item => item.playState === 'running').length), 0);
    await closeAndReturn(page, page.locator('.org-tree [data-org-person="messi"]'), 'escape');
    await noOverflow(page, `${viewport.width}: reduced motion`);
    result.webglContexts.push(...await page.evaluate(() => window.__webglContexts));
    result.viewports.push({ ...viewport, collectionTabs: true, keyboard: true, rapidSwitch: true, authenticFaces: 4, inventedBacks: false, exactHierarchy: true, profileNavigation: true, dialogDismissalAndFocusReturn: true, reducedMotion: true, overflow: false, touchScroll: viewport.width === 390 });
    await page.close();
    currentPage = null;
  }
  await recordScroll({ width: 390, height: 844 }, 'mobile');
  await recordScroll({ width: 1440, height: 900 }, 'desktop');
  for (const key of ['pageErrors', 'badResponses', 'outsideRequests', 'prohibitedRequests', 'webglContexts']) assert.deepEqual(result[key], [], key);
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.failure = { message: error.message, stack: error.stack };
  if (currentPage && !currentPage.isClosed()) await currentPage.screenshot({ path: `${dir}/failure.png`, fullPage: true }).catch(() => {});
  throw error;
} finally {
  writeFileSync(`${dir}/prototype-verification.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}
