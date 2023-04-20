import { Command, Option } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import { createServer } from '../server/http-server'
import loadConfig from '../server/config'
import { warn } from '../lib/logger'

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

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 4000))
}

async function run(options: any) {
  // eslint-disable-next-line prefer-const
  let { port, hostname, environment, directory } = options

  const projectDir = getProjectDirectory(directory)

  if (!hostname) hostname = 'localhost'
  if (isNaN(port)) port = 3000
  if (!environment) environment = 'development'

  warn(
    'This project is currently under development, and it is not ready for production.',
  )
  await sleep()

  const config = await loadConfig({ projectDir, environment })
  await createServer({ port, hostname, projectDir, config })
}

export default { command }
