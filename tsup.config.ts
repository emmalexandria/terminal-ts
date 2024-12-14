import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
      "src/server.ts",
      "src/commands.ts",
      "src/handlers.ts",
    ],

    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
  },
]);
