import path from 'path'
import { InputOptions, OutputOptions } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export async function generateInputs(directory: string) {
  const { globby } = await import('globby')

  const filePaths = await globby(['src/**/*.{js,ts}'])
  const entries = filePaths.map((file) => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length),
    ),
    path.join(directory, file),
  ])

  return Object.fromEntries(entries)
}

export async function createOptions(
  directory: string,
  distFolder: string,
  usingTypescript: boolean,
): Promise<{
  inputOptions: InputOptions
  outputOptions: OutputOptions
}> {
  // Dynamically importing this because it is an esm module
  const { externals } = await import('rollup-plugin-node-externals')

  return {
    inputOptions: {
      input: await generateInputs(directory),
      plugins: [
        ...(usingTypescript
          ? [
              typescript({
                tsconfig: path.join(directory, 'tsconfig.json'),
              }),
            ]
          : []),
        resolve(),
        commonjs(),
        externals(),
      ],
    },
    outputOptions: {
      format: 'cjs',
      dir: distFolder,
    },
  }
}
