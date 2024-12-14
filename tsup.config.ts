import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/terminal.ts",
      "src/vfs.ts",
      "src/commands.ts",
      "src/handlers.ts",
    ],

    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
  },
]);
