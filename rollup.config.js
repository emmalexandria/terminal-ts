import nodeResolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { type } from "os";

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "src/index.ts",
    output: {
      file: `dist/cdn/terminal-ts.min.js`,
      format: "umd",
      name: "TerminalTS",
      sourcemap: true,
    },
    plugins: [nodeResolve(), typescript({ outDir: "dist/cdn" }), terser()]
  },
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
        format: "esm",
      }
    ],
    plugins: [nodeResolve(), typescript()]
  }
]
