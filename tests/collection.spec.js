import { test, expect } from '@playwright/test';

for (const width of [320, 390, 768, 1440]) {
  test(`quatre maillots authentiques en 2D, sans dos ni téléchargement 3D à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 761 ? 844 : 900 });
    const requests = [], errors = [];
    page.on('request', request => requests.push(request.url()));
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.locator('#collection').scrollIntoViewIfNeeded();
    for (const [index, name] of ['Domicile V1', 'Domicile V2', 'Extérieur', 'Third'].entries()) {
      const tab = page.getByRole('tab', { name, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await expect(page.locator('#kit-name')).toHaveText(name);
      await expect(page.locator('#kit-panel')).toHaveAttribute('data-presentation', '2d');
      await expect(page.locator('#kit-image')).toBeVisible();
      await expect(page.locator('#kit-image')).toHaveAttribute('src', '/assets/collection.webp');
      const image = await page.locator('#kit-image').evaluate(el => {
        const box = el.getBoundingClientRect();
        return { ratio: box.width / box.height, original: el.naturalWidth / el.naturalHeight, mask: getComputedStyle(el).maskImage };
      });
      expect(image.ratio).toBeCloseTo(image.original, 3);
      expect(image.mask).toContain('collection-mask.png');
      expect(await page.locator('#kit-number').innerText()).toBe(`0${index + 1}`);
    }
    await expect(page.locator('#collection canvas, #collection [data-view], #kit-back-state')).toHaveCount(0);
    expect(await page.locator('#collection').innerText()).not.toMatch(/vue de dos|en attente|360°/i);
    expect(requests.filter(url => /\.glb|jersey-viewer|three(?:\.|_|-)/.test(url))).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('le masque retire le fond extérieur et conserve les quatre centres de maillot', async ({ page }) => {
  await page.goto('/');
  const pixels = await page.evaluate(async () => {
    const image = new Image(); image.src = '/assets/collection-mask.png'; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    return [[0, 0], [1800, 800], [265, 400], [703, 400], [1132, 400], [1570, 400]].map(([x, y]) => ctx.getImageData(x, y, 1, 1).data[3]);
  });
  expect(pixels).toEqual([0, 0, 255, 255, 255, 255]);
});

test('sélection rapide et clavier, sans état d’animation périmé', async ({ page }) => {
  await page.goto('/');
  const first = page.getByRole('tab', { name: 'Domicile V1', exact: true });
  await first.focus(); await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Third', exact: true })).toBeFocused();
  await page.keyboard.press('Home'); await expect(first).toBeFocused();
  await page.evaluate(() => { for (const i of [1, 3, 0, 2, 1]) document.querySelector(`[data-kit="${i}"]`).click(); });
  await expect(page.locator('#kit-name')).toHaveText('Domicile V2');
  await page.waitForTimeout(350);
  await expect(page.locator('#kit-name')).toHaveText('Domicile V2');
  await expect(page.locator('#kit-panel')).toHaveAttribute('aria-labelledby', 'kit-tab-1');
});

test('le geste tactile sur le maillot conserve le défilement vertical', async ({ browser, baseURL }) => {
  const page = await browser.newPage({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true });
  await page.goto('/'); await page.locator('#kit-panel').scrollIntoViewIfNeeded();
  const box = await page.locator('.kit-viewport').boundingBox(), before = await page.evaluate(() => scrollY);
  const cdp = await page.context().newCDPSession(page);
  const start = { x: box.x + box.width / 2, y: Math.min(740, box.y + box.height / 2) };
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
  for (let step = 1; step <= 6; step++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x, y: start.y - step * 30 }] }); await page.waitForTimeout(25); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 30);
  await page.close();
});
