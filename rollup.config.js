import nodeResolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "src/client/index.ts",
    output: {
      dir: "dist/client",
      format: "umd",
      name: "TerminalTS",
      sourcemap: true,
    },
    plugins: [
      del({ targets: "./dist/client/*" }),
      nodeResolve({ browser: true }),
      typescript({ tsconfig: "tsconfig.client.json" }),
      terser({})
    ]
  },
  {
    input: "src/node/index.ts",
    output: {
      dir: "dist/node",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src"
    },
    plugins: [
      nodeResolve(),
      typescript({ tsconfig: "tsconfig.server.json" }),
    ]
  },
  {
    input: "dist/browser/types/index.d.ts",
    output: {
      file: "dist/browser/index.d.ts",
      format: "es"
    },
    plugins: [
      dts(),
      del({ targets: "dist/browser/types" })
    ]
  }
]
