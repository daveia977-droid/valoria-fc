import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const origin = 'http://127.0.0.1:4186';
const dir = 'artifacts/motion-prototype';
const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 844, height: 390 },
];
const progressSamples = [0, .05, .1, .15, .2, .25, .3, .4, .55, .7, .9, 1];
const result = {
  status: 'running',
  source: 'Compiled standalone HTML/CSS/JavaScript prototype; existing local assets',
  viewports: [], entry: [], a11y: [], pageErrors: [], badResponses: [], outsideRequests: [], videos: [],
};
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});

function watchRequests(page, label) {
  page.on('pageerror', error => result.pageErrors.push({ label, message: error.message }));
  page.on('response', response => {
    if (response.status() >= 400) result.badResponses.push({ label, url: response.url(), status: response.status() });
  });
  page.on('request', request => {
    const url = new URL(request.url());
    if (['http:', 'https:'].includes(url.protocol) && url.origin !== origin) result.outsideRequests.push({ label, url: url.href });
  });
}

// Sample rendered entry frames, including frames before fonts finish loading.
async function watchEntry(page) {
  await page.addInitScript(() => {
    window.__entryCheck = { done: false, samples: 0, violations: [] };
    const start = performance.now();
    const opacityOf = node => {
      let opacity = 1;
      for (let element = node; element; element = element.parentElement) opacity *= Number(getComputedStyle(element).opacity);
      return opacity;
    };
    function check() {
      const title = document.querySelector('.opening h1');
      const crest = document.querySelector('.emblem img');
      if (title && crest && opacityOf(title) > .1 && opacityOf(crest) > .1) {
        const a = title.getBoundingClientRect(), b = crest.getBoundingClientRect();
        window.__entryCheck.samples++;
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) {
          window.__entryCheck.violations.push({ time: Math.round(performance.now() - start), title: a.toJSON(), crest: b.toJSON() });
        }
      }
      if (performance.now() - start < 1900) requestAnimationFrame(check);
      else window.__entryCheck.done = true;
    }
    requestAnimationFrame(check);
  });
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function scrollToProgress(page, progress) {
  await page.evaluate(value => {
    document.documentElement.style.scrollBehavior = 'auto';
    const story = document.querySelector('.story');
    scrollTo({ top: story.offsetTop + Math.max(0, story.offsetHeight - innerHeight) * value, behavior: 'instant' });
  }, progress);
  await settle(page);
  try {
    await page.waitForFunction(value => Math.abs(Number(document.querySelector('.scene').dataset.progress) - value) < .008, progress, { timeout: 5000 });
  } catch (error) {
    const state = await page.evaluate(() => ({ y: scrollY, progress: document.querySelector('.scene').dataset.progress, focus: document.activeElement.outerHTML.slice(0, 180), hidden: document.hidden, classes: document.documentElement.className }));
    throw new Error(`Scroll target ${progress} not reached: ${JSON.stringify(state)}`, { cause: error });
  }
}

async function opacity(page, selector) {
  return page.locator(selector).evaluate(node => {
    let value = 1;
    for (let element = node; element; element = element.parentElement) value *= Number(getComputedStyle(element).opacity);
    return value;
  });
}

function overlap(a, b) {
  return Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1
    && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
}

async function separated(page, first, second, label) {
  const a = await page.locator(first).boundingBox(), b = await page.locator(second).boundingBox();
  assert(a && b, `${label}: both elements must have rendered bounds`);
  assert(!overlap(a, b), `${label}: ${first} intersects ${second}: ${JSON.stringify({ a, b })}`);
}

async function noOverflow(page, label) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: horizontal overflow`);
}

async function readable(page, selector) {
  const state = await page.locator(selector).evaluate(node => {
    let opacity = 1, hidden = false;
    for (let element = node; element; element = element.parentElement) {
      const style = getComputedStyle(element);
      opacity *= Number(style.opacity);
      hidden ||= style.display === 'none' || style.visibility === 'hidden' || element.getAttribute('aria-hidden') === 'true' || element.inert;
    }
    const rect = node.getBoundingClientRect();
    return { opacity, hidden, width: rect.width, height: rect.height };
  });
  assert(!state.hidden && state.opacity > .95 && state.width > 0 && state.height > 0, `${selector} is not readable: ${JSON.stringify(state)}`);
}

async function audit(page, viewport, state) {
  if (![390, 1440].includes(viewport.width)) return;
  const violations = await page.evaluate(async () => {
    const audit = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
    return audit.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }));
  });
  result.a11y.push({ ...viewport, state, violations });
  assert.deepEqual(violations, [], `${viewport.width}: ${state} accessibility audit`);
}

async function goToIdentity(page, staticMode) {
  await page.getByRole('navigation').getByRole('link', { name: 'Le club', exact: true }).click();
  if (staticMode) {
    await page.waitForFunction(() => {
      const rect = document.querySelector('.identity h2').getBoundingClientRect();
      return rect.top >= 0 && rect.top < innerHeight;
    });
  } else {
    await page.waitForFunction(() => Math.abs(Number(document.querySelector('.scene').dataset.progress) - .94) < .008);
    // Let the native smooth anchor finish before an independent keyboard/reverse test.
    await page.waitForTimeout(150);
  }
  await readable(page, '.identity h2');
  assert.equal(await page.locator('.identity').evaluate(node => node.inert), false);
}

async function keyboardToIdentityLink(page) {
  await page.getByRole('navigation').getByRole('link', { name: 'Le club', exact: true }).focus();
  let reached = false;
  for (let index = 0; index < 20; index++) {
    await page.keyboard.press('Tab');
    reached = await page.locator('.identity .line-link').evaluate(node => document.activeElement === node);
    if (reached) break;
  }
  assert(reached, 'Identity link must be reachable with Tab, not only programmatic focus');
}

async function touchScroll(page, viewport) {
  const session = await page.context().newCDPSession(page);
  const x = Math.round(viewport.width * .5), startY = Math.round(viewport.height * .8), endY = Math.round(viewport.height * .3);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: startY }] });
  for (let index = 1; index <= 8; index++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: Math.round(startY + (endY - startY) * index / 8) }] });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(() => scrollY > 8 && Number(document.querySelector('.scene').dataset.progress) > .01);
  await session.detach();
}

async function saveScreenshot(page, name, fullPage = false) {
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage });
}

async function recordScroll(viewport, name) {
  const frames = `${dir}/frames-${name}`;
  mkdirSync(frames, { recursive: true });
  const page = await browser.newPage({ viewport, hasTouch: name === 'mobile', reducedMotion: 'no-preference' });
  watchRequests(page, `video-${name}`);
  await page.goto(origin);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
  let index = 0;
  const capture = async () => {
    await page.screenshot({ path: `${frames}/f${String(index++).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 90 });
  };
  for (let hold = 0; hold < 8; hold++) await capture();
  for (let step = 0; step <= 32; step++) { await scrollToProgress(page, step / 32); await capture(); }
  for (let hold = 0; hold < 8; hold++) await capture();
  for (let step = 32; step >= 0; step--) { await scrollToProgress(page, step / 32); await capture(); }
  for (let hold = 0; hold < 14; hold++) await capture();
  result.videos.push({ name, viewport, frames: index, fps: 12, durationSeconds: index / 12, framePattern: `${frames}/f%03d.jpg`, method: 'Browser-rendered scroll frames, including reverse scroll; encoded separately with ffmpeg' });
  await page.close();
}

try {
  for (const viewport of viewports) {
    const label = `${viewport.width}x${viewport.height}`;
    const page = await browser.newPage({ viewport, hasTouch: viewport.width < 761 || viewport.height < 500, reducedMotion: 'no-preference' });
    watchRequests(page, label);
    await watchEntry(page);
    await page.goto(origin, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.__entryCheck.done);
    const entry = await page.evaluate(() => window.__entryCheck);
    result.entry.push({ ...viewport, ...entry });
    assert(entry.samples > 0, `${label}: no visible entry frames sampled`);
    assert.deepEqual(entry.violations, [], `${label}: title and crest overlap during entry`);
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
    assert.equal(await page.locator('h1').count(), 1);
    await noOverflow(page, label);
    await audit(page, viewport, 'initial');

    const getPose = () => page.locator('.emblem').evaluate(node => [getComputedStyle(node).transform, getComputedStyle(node.querySelector('img')).transform]);
    await scrollToProgress(page, 0);
    const initialPose = await getPose();
    if ([390, 1440].includes(viewport.width) || viewport.height < 600) await saveScreenshot(page, `hero-initial-${label}`);
    for (const progress of progressSamples) {
      await scrollToProgress(page, progress);
      await noOverflow(page, `${label} at ${progress}`);
      if (await opacity(page, '.opening h1') > .1) await separated(page, '.opening h1', '.emblem img', `${label} at progress ${progress}`);
    }
    assert.notDeepEqual(await getPose(), initialPose, `${label}: crest must move through the scene`);
    await readable(page, '.identity h2');
    assert.equal(await page.locator('.identity').evaluate(node => node.inert), false);
    for (const selector of ['.identity .overline', '.identity h2', '.identity-copy', '.identity .line-link']) {
      await separated(page, selector, '.emblem img', `${label}: final text/crest composition`);
    }
    for (const selector of ['.identity h2', '.identity .line-link', '.emblem img']) {
      const bounds = await page.locator(selector).boundingBox();
      assert(bounds && bounds.y >= -1 && bounds.y + bounds.height <= viewport.height + 1, `${label}: final ${selector} must fit vertically: ${JSON.stringify(bounds)}`);
    }
    await audit(page, viewport, 'identity');
    if ([390, 1440].includes(viewport.width) || viewport.height < 600) await saveScreenshot(page, `hero-identity-${label}`);
    await scrollToProgress(page, 0);
    assert.deepEqual(await getPose(), initialPose, `${label}: reverse scroll must recover the exact original pose`);

    // A disappearing branch must return focus to the persistent club navigation.
    const clubLink = page.getByRole('navigation').getByRole('link', { name: 'Le club', exact: true });
    const heroLink = page.locator('.hero-action a');
    const heroFocusTested = await heroLink.isVisible();
    if (heroFocusTested) {
      await heroLink.focus();
      await scrollToProgress(page, .9);
      assert(await clubLink.evaluate(node => document.activeElement === node), `${label}: hiding the hero action must restore focus to Le club`);
      await scrollToProgress(page, 0);
    }

    let touch = false;
    if (viewport.width === 390) {
      await touchScroll(page, viewport);
      touch = true;
      // Let gesture momentum settle before testing scripted anchors.
      await page.waitForTimeout(500);
      await scrollToProgress(page, 0);
    }
    await goToIdentity(page, false);
    await keyboardToIdentityLink(page);
    await scrollToProgress(page, 0);
    assert(await clubLink.evaluate(node => document.activeElement === node), `${label}: hiding the identity link must restore focus to Le club`);
    await goToIdentity(page, false);
    await keyboardToIdentityLink(page);
    const identityTopBeforePause = (await page.locator('.identity h2').boundingBox()).y;
    await page.locator('#pause').click();
    await page.waitForFunction(() => document.documentElement.classList.contains('static-motion'));
    await settle(page);
    const pauseHeadingShift = (await page.locator('.identity h2').boundingBox()).y - identityTopBeforePause;
    assert(Math.abs(pauseHeadingShift) <= 2, `${label}: pausing must preserve the identity heading position (shift: ${pauseHeadingShift}px)`);
    assert.equal(await page.locator('#pause').getAttribute('aria-pressed'), 'true');
    assert(await page.locator('#pause').evaluate(node => document.activeElement === node), 'Pause must retain focus on its toggle');
    await readable(page, '.opening h1');
    await readable(page, '.identity h2');
    await readable(page, '.identity .line-link');
    assert.equal(await page.locator('.identity').evaluate(node => node.inert), false);
    await noOverflow(page, `${label}: pause`);
    await goToIdentity(page, true);
    await page.locator('#pause').click();
    await page.waitForFunction(() => !document.documentElement.classList.contains('static-motion'));
    await scrollToProgress(page, 0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.documentElement.classList.contains('static-motion'));
    await readable(page, '.opening h1');
    await readable(page, '.identity h2');
    await readable(page, '.identity .line-link');
    assert.equal(await page.locator('.identity').evaluate(node => node.inert), false);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length), 0, 'Reduced motion must stop all running animations');
    await noOverflow(page, `${label}: reduced motion`);
    if (viewport.width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await saveScreenshot(page, 'hero-reduced-motion-390x844', true);
    }
    await goToIdentity(page, true);
    await keyboardToIdentityLink(page);
    await audit(page, viewport, 'reduced-motion');
    result.viewports.push({ ...viewport, overflow: false, entryAndScrollNoOverlap: true, reversibleScroll: true, identityLayout: true, reducedMotionBothChapters: true, pausePreservesContentAndFocus: true, pauseHeadingShift, identityFocusRestored: true, heroFocusRestored: heroFocusTested ? true : 'Hero action hidden in short landscape layout', keyboard: true, touchScroll: touch });
    await page.close();
  }

  await recordScroll({ width: 390, height: 844 }, 'mobile');
  await recordScroll({ width: 1440, height: 900 }, 'desktop');
  assert.deepEqual(result.pageErrors, [], 'No uncaught JavaScript errors');
  assert.deepEqual(result.badResponses, [], 'No missing assets');
  assert.deepEqual(result.outsideRequests, [], 'Prototype must remain self-contained');
  result.status = 'passed';
} catch (error) {
  result.status = 'failed';
  result.failure = { message: error.message, stack: error.stack };
  throw error;
} finally {
  writeFileSync(`${dir}/prototype-verification.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}
