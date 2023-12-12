import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  assetsInclude: ["./assests/**/*.*"],
  build: {
    emptyOutDir: true,
    outDir: "../dist",
  },
});
