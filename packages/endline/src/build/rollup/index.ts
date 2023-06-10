import { OutputOptions, rollup, RollupBuild } from 'rollup'
import { error, warn } from '../../lib/logger'
import { createOptions } from './options'

async function generateOutputs(
  bundle: RollupBuild,
  outputOptions: OutputOptions,
) {
  const { output } = await bundle.generate(outputOptions)

  for (const chunk of output) {
    if (chunk.type === 'asset') {
      // If the file is a source map, ignore it
      if (/\.js\.map$/.test(chunk.fileName)) continue

      warn(
        `Found chunk of type 'asset', support for this is not implemented yet and will be ignored by the compiler: ${chunk.fileName}`,
      )
      continue
    }

    await bundle.write(outputOptions)
  }
}

export async function build(
  projectDir: string,
  {
    distFolder,
    typescript,
    isDev,
  }: { distFolder: string; typescript: boolean; isDev: boolean },
) {
  const { inputOptions, outputOptions } = await createOptions(
    projectDir,
    distFolder,
    {
      usingTypescript: typescript,
      includeSourcemaps: isDev,
    },
  )

  let bundle
  try {
    bundle = await rollup({
      ...inputOptions,
      output: outputOptions,
      onwarn: (message) => {
        warn(message.message)

        if (message.loc) {
          console.log(message.loc.file)
        }

        if (message.frame) {
          console.log(message.frame)
        }
      },
    })

    await generateOutputs(bundle, outputOptions)
  } catch (e) {
    bundle?.close()

    error(e)
    process.exit(1)
  }
}
