import glob from 'glob'
import path from 'node:path'
import { InputOptions, OutputOptions, rollup, RollupBuild } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { error, warn } from '../../../lib/logger'

async function createOptions(
  directory: string,
  distFolder: string,
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

async function generateOutputs(
  bundle: RollupBuild,
  outputOptions: OutputOptions,
) {
  const { output } = await bundle.generate(outputOptions)

  for (const chunk of output) {
    console.log(`- [${chunk.type}]`, chunk.fileName)

    if (chunk.type === 'asset') {
      warn(
        `Found chunk of type 'asset', support for this is not implemented yet and will be ignored by the compiler: ${chunk.fileName}`,
      )
      continue
    }

    await bundle.write(outputOptions)
  }
}

export async function build(projectDir: string, distFolder: string) {
  const { inputOptions, outputOptions } = await createOptions(
    projectDir,
    distFolder,
  )
  let bundle
  try {
    bundle = await rollup({ ...inputOptions, output: outputOptions })

    await generateOutputs(bundle, outputOptions)
  } catch (e) {
    bundle?.close()

    error(e)
    process.exit(1)
  }
}
