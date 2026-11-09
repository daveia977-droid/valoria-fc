// Preserve the optional, manual GitHub Pages build without obsolete 3D assertions.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const base = '/valoria-fc/', port = process.env.PAGES_PREVIEW_PORT || '4175';
assert(readFileSync('dist/index.html', 'utf8').includes(`${base}assets/`), 'Build first with npm run build -- --base=/valoria-fc/');
const server = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview', '--base', base, '--host', '127.0.0.1', '--port', port, '--strictPort'], { stdio: 'ignore' });
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}${base}`)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert(ready, 'Pages preview did not start');
  const child = spawn(process.execPath, ['tools/verify_release.mjs'], { stdio: 'inherit', env: { ...process.env, VALORIA_SITE_URL: `http://127.0.0.1:${port}${base}`, VALORIA_REPORT_DIR: 'artifacts/github-pages' } });
  const code = await new Promise(resolve => child.on('exit', resolve)); assert.equal(code, 0);
} finally { server.kill('SIGTERM'); }
