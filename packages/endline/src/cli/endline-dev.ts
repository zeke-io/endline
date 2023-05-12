import { Command, Option } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import { initializeDevServer } from '../server'
import loadConfig from '../config'

const command = new Command('dev')
  .description('Starts the Endline App in development mode')
  .addOption(
    new Option('-p, --port <number>', 'set port')
      .argParser((val) => parseInt(val, 10))
      .default(3000),
  )
  .option('-H, --hostname <host>', 'set hostname', 'localhost')
  .option('-e, --environment <name>', 'set environment', 'development')
  .option('-d, --directory <path>', 'set the root directory of the project')
  .action(run)

async function run(options: any) {
  // eslint-disable-next-line prefer-const
  let { port, hostname, environment, directory } = options

  if (!hostname) hostname = 'localhost'
  if (isNaN(port)) port = 3000
  if (!environment) environment = 'development'

  const projectDir = getProjectDirectory(directory)
  const config = await loadConfig({ projectDir, environment })
  await initializeDevServer({ port, hostname, projectDir, config })
}

export default { command }
