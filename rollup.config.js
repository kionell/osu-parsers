import typescript from "@rollup/plugin-typescript";
import externals from "rollup-plugin-node-externals";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";

export default [
  {
    plugins: [
      typescript(),
      externals({
        deps: true,
      }),
      commonjs(),
    ],
    input: "./src/core/index.ts",
    output: [
      {
        file: "./lib/node.cjs",
        format: "cjs",
      },
    ],
  },
  {
    plugins: [
      typescript(),
      externals({
        deps: true,
      }),
    ],
    input: "./src/core/index.ts",
    output: [
      {
        file: "./lib/node.mjs",
        format: "es",
      },
    ],
  },
  {
    plugins: [
      typescript({
        rootDirs: ["./src/core", "./src/browser"],
      }),
      externals({
        deps: true,
      }),
      commonjs(),
    ],
    input: "./src/core/index.ts",
    output: [
      {
        file: "./lib/browser.cjs",
        format: "cjs",
      },
    ],
  },
  {
    plugins: [
      typescript({
        rootDirs: ["./src/core", "./src/browser"],
      }),
      externals({
        deps: true,
      }),
    ],
    input: "./src/core/index.ts",
    output: [
      {
        file: "./lib/browser.mjs",
        format: "es",
      },
    ],
  },
  {
    plugins: [
      typescript(),
      dts({
        compilerOptions: {
          removeComments: false,
        },
      }),
      externals({
        deps: true,
      }),
    ],
    input: "./src/core/index.ts",
    output: {
      file: "./lib/index.d.ts",
      format: "es",
    },
  },
];
