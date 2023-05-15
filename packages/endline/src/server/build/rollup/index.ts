import { OutputOptions, rollup, RollupBuild } from 'rollup'
import { error, warn } from '../../../lib/logger'
import { createOptions } from './options'

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
