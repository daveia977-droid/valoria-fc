// Derive a display-only alpha mask from the supplied atlas; never rewrite its pixels.
// Local Chromium/Canvas, no AI, model, network service or additional dependency.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const source = readFileSync('public/assets/collection.webp');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  const result = await page.evaluate(async base64 => {
    const image = new Image(); image.src = `data:image/webp;base64,${base64}`; await image.decode();
    const width = image.naturalWidth, height = image.naturalHeight, length = width * height;
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, width, height).data;
    const outside = new Uint8Array(length), queue = new Uint32Array(length);
    let head = 0, tail = 0;
    const isBackground = p => Math.max(Math.abs(pixels[p * 4] - 17), Math.abs(pixels[p * 4 + 1] - 16), Math.abs(pixels[p * 4 + 2] - 20)) <= 8;
    function visit(p) { if (!outside[p] && isBackground(p)) { outside[p] = 1; queue[tail++] = p; } }
    for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
    for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
    while (head < tail) {
      const p = queue[head++], x = p % width;
      if (x) visit(p - 1); if (x < width - 1) visit(p + 1);
      if (p >= width) visit(p - width); if (p < length - width) visit(p + width);
    }
    // Exclude disconnected dust/shadows, retaining connected garment silhouettes.
    const visited = new Uint8Array(length), retained = new Uint8Array(length);
    let components = 0;
    for (let start = 0; start < length; start++) {
      if (outside[start] || visited[start]) continue;
      head = 0; tail = 0; queue[tail++] = start; visited[start] = 1;
      while (head < tail) {
        const p = queue[head++], x = p % width;
        for (const n of [x ? p - 1 : -1, x < width - 1 ? p + 1 : -1, p >= width ? p - width : -1, p < length - width ? p + width : -1]) {
          if (n >= 0 && !outside[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; }
        }
      }
      if (tail > 10000) { components++; for (let i = 0; i < tail; i++) retained[queue[i]] = 1; }
    }
    const mask = context.createImageData(width, height);
    let foreground = 0;
    for (let p = 0; p < length; p++) {
      mask.data[p * 4] = mask.data[p * 4 + 1] = mask.data[p * 4 + 2] = 255;
      mask.data[p * 4 + 3] = retained[p] ? 255 : 0; foreground += retained[p];
    }
    context.putImageData(mask, 0, 0);
    return { png: canvas.toDataURL('image/png').split(',')[1], width, height, components, foreground };
  }, source.toString('base64'));
  writeFileSync('public/assets/collection-mask.png', Buffer.from(result.png, 'base64'));
  delete result.png;
  writeFileSync('design/maillots/collection-mask.json', JSON.stringify({ source: 'public/assets/collection.webp', sha256: createHash('sha256').update(source).digest('hex'), background: [17, 16, 20], tolerance: 8, method: 'Edge-connected background mask. Original image unchanged.', ...result }, null, 2) + '\n');
  console.log(result);
} finally { await browser.close(); }
