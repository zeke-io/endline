import { Command, Option } from 'commander'
import { createServer } from '../server/http-server'
import { getProjectDirectory } from '../lib/directory-resolver'
import { loadEnvFiles } from '../server/config/env-loader'
import loadConfig from '../server/config'

const command = new Command('dev')
  .description('Starts a development server')
  .addOption(
    new Option('-p, --port <number>', 'set port')
      .argParser((val) => parseInt(val, 10))
      .default(3000),
  )
  .option('-H, --hostname <host>', 'set hostname', 'localhost')
  .option('-e, --environment <name>', 'set environment', 'development')
  .action(run)

async function run(options: any) {
  // eslint-disable-next-line prefer-const
  let { port, hostname, environment } = options

  const projectDir = getProjectDirectory()

  if (!hostname) hostname = 'localhost'
  if (isNaN(port)) port = 3000
  if (!environment) environment = 'development'

  await loadEnvFiles({
    projectDir,
    environment,
  })
  const config = await loadConfig(projectDir)
  await createServer({ port, hostname, projectDir, config })
}

export default { command }
