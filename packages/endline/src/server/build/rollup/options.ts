import glob from 'glob'
import path from 'node:path'
import { InputOptions, OutputOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export async function createOptions(
  directory: string,
  distFolder: string,
  _typescript: boolean,
): Promise<{
  inputOptions: InputOptions
  outputOptions: OutputOptions
}> {
  // Dynamically importing this because it is an esm module
  const { externals } = await import('rollup-plugin-node-externals')

  return {
    inputOptions: {
      input: Object.fromEntries(
        glob
          .sync('src/**/*.js')
          .map((file) => [
            path.relative(
              'src',
              file.slice(0, file.length - path.extname(file).length),
            ),
            path.join(directory, file),
          ]),
      ),
      plugins: [nodeResolve(), externals()],
    },
    outputOptions: {
      format: 'cjs',
      dir: distFolder,
    },
  }
}
