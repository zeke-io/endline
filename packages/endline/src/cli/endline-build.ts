import { Command } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import loadConfig from '../config'
import build from '../build'

const command = new Command('build')
  .description('Compiles the Endline app for production')
  .option('-d, --directory <path>', 'set the root directory of the project')
  .action(run)

async function run(options: { directory?: string }) {
  const { directory } = options

  const projectDir = getProjectDirectory(directory)

  const config = await loadConfig({ projectDir })
  await build({ projectDir, config })
}

export default { command }
