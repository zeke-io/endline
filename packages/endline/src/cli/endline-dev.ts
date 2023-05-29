import { Command, Option } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import { initializeDevServer } from '../server'
import loadConfig from '../config'
import { warn } from '../lib/logger'

const command = new Command('dev')
  .description('Start the Endline app in development mode')
  .addOption(
    new Option('-p, --port <number>', 'set port')
      .argParser((val) => parseInt(val, 10))
      .default(3000),
  )
  .option('-H, --hostname <host>', 'set the hostname', 'localhost')
  .option('-d, --directory <path>', 'set the root directory of the project')
  .action(run)

async function run(options: {
  port: number
  hostname: string
  directory?: string
}) {
  warn(
    `This project is still in its early stages and under active development. It is not yet ready to be used in a production environment.`,
    `\nIf you'd like to contribute with code, report issues, or give suggestions, check out the project's repository: https://github.com/zeke-io/endline.`,
  )
  // eslint-disable-next-line prefer-const
  let { port, hostname, directory } = options

  if (!hostname) hostname = 'localhost'
  if (isNaN(port)) port = 3000

  const projectDir = getProjectDirectory(directory)
  const config = await loadConfig(projectDir)
  await initializeDevServer({ port, hostname, projectDir, config })
}

export default { command }
