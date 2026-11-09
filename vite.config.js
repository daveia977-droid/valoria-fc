import { defineConfig } from "vite";

export default defineConfig(({ command, isPreview }) => ({
  // GitHub project Pages serves dist under /valoria-fc/. Keep the existing
  // development URL at / so the local site and its tests remain compatible.
  base: command === "build" || isPreview ? "/valoria-fc/" : "/",
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
}));
