import fs from 'fs'
import path from 'path'
import { EndlineRequiredConfig } from '../../config'
import { findDirectory } from '../../lib/directory-resolver'
import { done, info } from '../../lib/logger'
import { WebpackCompiler } from './webpack/compiler'
import { build as rollupBuild } from './rollup'

export default async function build({
  projectDir,
  config,
  useRollup,
}: {
  projectDir: string
  config: EndlineRequiredConfig
  useRollup: boolean
}) {
  const outputPath = path.join(projectDir, config.distDir)
  /** If dist folder exists, clean it */
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true })
  }

  /** Create dist folder */
  fs.mkdirSync(outputPath, { recursive: true })

  info('Building application...')

  const folderPath = config.router.routesDirectory
  // TODO: Refactor
  const routesDirectory =
    findDirectory(projectDir, folderPath || 'routes', !folderPath) ||
    'src/routes'

  const typescriptConfig = path.join(projectDir, 'tsconfig.json')
  const useTypescript = fs.existsSync(typescriptConfig)

  /** Compile the application */
  if (useRollup) {
    await rollupBuild(projectDir, {
      distFolder: outputPath,
      typescript: useTypescript,
    })
  } else {
    const compiler = new WebpackCompiler({
      projectDir,
      routesDirectory,
      clean: true,
    })

    await compiler.run(outputPath)
  }

  /** Write the main.js server file to run the built app */
  const mainServerFile = await fs.promises.readFile(
    path.join(__dirname, './_main.js'),
  )
  fs.writeFileSync(path.join(outputPath, 'main.js'), mainServerFile)

  done('The application has been compiled successfully.')
}
