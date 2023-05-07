import fs from 'fs'
import path from 'path'
import { WebpackCompiler } from './compiler'
import { EndlineConfig } from '../config'
import { findDirectory } from '../../lib/directory-resolver'
import { done, info } from '../../lib/logger'

export default async function build({
  projectDir,
  config,
}: {
  projectDir: string
  config: EndlineConfig
}) {
  const outputPath = path.join(projectDir, config.distDir)
  /** If dist folder exists, clean it */
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true })
  }

  /** Create dist folder */
  fs.mkdirSync(outputPath, { recursive: true })

  info('Building application...')

  /** Write the main.js server file to run the built app */
  const mainServerFile = await fs.promises.readFile(
    path.join(__dirname, './_main.js'),
  )
  fs.writeFileSync(path.join(outputPath, 'main.js'), mainServerFile)

  const folderPath = config.router.routesDirectory
  const routesDirectory = findDirectory(
    projectDir,
    folderPath || 'routes',
    !folderPath,
  )

  /** Compile the application */
  const compiler = new WebpackCompiler({
    projectDir,
    config,
    routesDirectory,
  })

  await compiler.run(outputPath)

  done('The application has been compiled successfully.')
}
