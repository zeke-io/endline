import { WebpackCompiler } from './compiler'
import { EndlineConfig } from '../config'
import fs from 'fs'
import path from 'path'

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
  const compiler = new WebpackCompiler({
    projectDir,
    config,
  })

  await compiler.run(outputPath)

  await fs.promises.writeFile(
    path.join(outputPath, 'main.js'),
    mainServerContents,
  )
}
