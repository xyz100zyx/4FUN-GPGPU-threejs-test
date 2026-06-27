import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

export default defineConfig({
  plugins: [
    glsl(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@core": path.resolve(__dirname, "./src/core"),
    },
  },

  build: {
    chunkSizeWarningLimit: 599,
    rolldownOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        codeSplitting: {
          groups: [
            {
              test: /node_modules\/three/,
              name: "three-vendor",
            },
          ],
        },
      },
    },
  },
});
