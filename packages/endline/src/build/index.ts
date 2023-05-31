import fs from 'fs'
import path from 'path'
import { EndlineRequiredConfig } from '../config'
import { done, info } from '../lib/logger'
import { build as rollupBuild } from './rollup'

export default async function build({
  projectDir,
  config,
}: {
  projectDir: string
  config: EndlineRequiredConfig
}) {
  const outputPath = path.join(projectDir, config.distDir)
  /** If dist folder exists, clean it */
  if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, { recursive: true })
  }

  /** Create dist folder */
  fs.mkdirSync(outputPath, { recursive: true })

  info('Building application...')

  const typescriptConfig = path.join(projectDir, 'tsconfig.json')
  const useTypescript = fs.existsSync(typescriptConfig)

  /** Compile the application */
  await rollupBuild(projectDir, {
    distFolder: outputPath,
    typescript: useTypescript,
  })

  /** Write the main.js server file to run the built app */
  const mainServerFile = await fs.promises.readFile(
    path.join(__dirname, './_main.js'),
  )
  fs.writeFileSync(path.join(outputPath, 'main.js'), mainServerFile)

  done('The application has been compiled successfully.')
}
