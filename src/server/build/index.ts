import { WebpackCompiler } from './compiler'
import { EndlineConfig } from '../config'
import fs from 'fs'
import path from 'path'
import { findRouters } from '../router/router-loader'

const mainServerContents = `const port = parseInt(process.env.PORT, 10) || 3000

console.log(\`Server is ready and listening on port \${port}\`)`

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

  await fs.promises.writeFile(
    path.join(outputPath, 'main.js'),
    mainServerContents,
  )
}
