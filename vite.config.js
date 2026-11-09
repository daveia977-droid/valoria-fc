import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

function commitId() {
  const configured = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
  if (configured && /^[a-f0-9]{40}$/i.test(configured)) return configured;
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); }
  catch { return null; }
}

export default defineConfig({
  // Vercel is the official host. The legacy Pages build supplies its own --base.
  base: "/",
  plugins: [{
    name: 'valoria-public-version',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ project: 'VALORIA FC', commit: commitId() }) + '\n' });
    },
  }],
  build: { rollupOptions: { input: Object.fromEntries(["index", "mentions-legales", "confidentialite", "cgu"].map(page => [page, fileURLToPath(new URL(`./${page}.html`, import.meta.url))])) } },
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
