import { WebpackCompiler } from './compiler'
import { EndlineConfig } from '../config'

export default async function build({
  projectDir,
  config,
}: {
  projectDir: string
  config: EndlineConfig
}) {
  const compiler = new WebpackCompiler({
    projectDir,
    config,
  })

  await compiler.run()
}
