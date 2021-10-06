import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    plugins: [
      typescript({
        "removeComments": false,
        "declaration": true,
      }),
    ],
    input: './src/index.ts',
    output: [
      {
        file: './lib/index.js',
        format: 'es',
      },
    ],
  },
  {
    plugins: [dts()],
    input: './src/index.ts',
    output: {
      file: './lib/index.d.ts',
      format: 'es',
    },
  },
]