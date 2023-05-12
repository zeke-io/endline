import { Command } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import loadConfig from '../config'
import build from '../server/build'

const command = new Command('build')
  .description('Compiles the Endline App for production')
  .option('-d, --directory <path>', 'set the root directory of the project')
  .action(run)

async function run(options: any) {
  // eslint-disable-next-line prefer-const
  let { directory } = options

  const projectDir = getProjectDirectory(directory)

  const config = await loadConfig({ projectDir })
  await build({ projectDir, config })
}

export default { command }