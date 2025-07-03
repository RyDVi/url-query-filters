import { defineConfig, type UserConfigExport } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default function baseViteConfig(
  entry: string,
  name: string
): UserConfigExport {
  return defineConfig({
    build: {
      lib: {
        entry,
        name,
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format}.js`,
      },
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: true,
    },
    plugins: [
      tsconfigPaths(),
      dts({ outDir: "dist", insertTypesEntry: true }),
    ],
  });
}
