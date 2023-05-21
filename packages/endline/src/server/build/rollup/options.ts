import { glob } from 'glob'
import path from 'node:path'
import { InputOptions, OutputOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export function generateInputs(directory: string) {
  return Object.fromEntries(
    glob
      .sync('src/**/*.{js,ts}')
      .map((file) => [
        path.relative(
          'src',
          file.slice(0, file.length - path.extname(file).length),
        ),
        path.join(directory, file),
      ]),
  )
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
      input: generateInputs(directory),
      plugins: [
        ...(usingTypescript
          ? [
              typescript({
                tsconfig: path.join(directory, 'tsconfig.json'),
              }),
            ]
          : []),
        nodeResolve(),
        externals(),
      ],
    },
    outputOptions: {
      format: 'cjs',
      dir: distFolder,
    },
  }
}
