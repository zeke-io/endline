import { Command, Option } from 'commander'
import { createServer } from '../server/http-server'
import { getProjectDirectory } from '../lib/directory-resolver'
import { loadEnvFiles } from '../server/config/env-loader'

const command = new Command('dev')
  .description('Starts a development server')
  .addOption(
    new Option('-p, --port <number>', 'set port')
      .argParser((val) => parseInt(val, 10))
      .default(3000),
  )
  .option('-H, --hostname <host>', 'set hostname', 'localhost')
  .action(run)

async function run(options: { port: number; hostname: string }) {
  let { port, hostname } = options
  const projectDir = getProjectDirectory()

  if (!hostname) hostname = 'localhost'
  if (isNaN(port)) port = 3000

  await loadEnvFiles({
    projectDir,
    environment: 'development',
  })
  await createServer({ port, hostname, projectDir })
}

export default { command }
