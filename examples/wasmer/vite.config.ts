import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { exec } from "node:child_process";

const cargoBuildPlugin: PluginOption = {
  name: "cargo-build",
  buildStart: () => {
    return new Promise((resolve, reject) => {
      exec("node ../../scripts/build.mjs", (err, stdout, stderr) => {
        if (err) {
          console.log("Stdout:", stdout);
          console.log("Stderr:", stderr);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
};

export default defineConfig({
  plugins: [cargoBuildPlugin, react(), tailwindcss()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["@wasmer/sdk"],
  },
});
