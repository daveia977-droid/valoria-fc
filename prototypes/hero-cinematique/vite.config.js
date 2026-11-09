import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
export default defineConfig({
 root,
 base:'./',
 publicDir:resolve(root,'../../public'),
 build:{outDir:resolve(root,'../../artifacts/hero-cinematique/dist'),emptyOutDir:true},
});
