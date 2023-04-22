import { WebpackCompiler } from './compiler'
import { EndlineConfig } from '../config'
import fs from 'fs'
import path from 'path'
import { findRouters } from '../router/router-loader'

export default async function build({
  projectDir,
  config,
}: {
  projectDir: string
  config: EndlineConfig
}) {
  const outputPath = path.join(projectDir, config.distDir)
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true })
  }

  const routeFiles = await findRouters(config.router.routesDirectory as string)

  const compiler = new WebpackCompiler({
    projectDir,
    config,
    routeFiles,
  })

  await compiler.run(outputPath)

  /**
   * Write the main.js server file to run the built app
   */
  const mainServerFile = await fs.promises.readFile(
    path.join(__dirname, './_main.js'),
  )
  await fs.promises.writeFile(path.join(outputPath, 'main.js'), mainServerFile)
}
