import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm", "cjs"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
