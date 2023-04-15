import fs from 'fs'
import path from 'path'
import { Command, Option } from 'commander'
import { createServer } from '../server/http-server'

const command = new Command('dev')
  .description('Starts a development server')
  .addOption(
    new Option('-p, --port <number>', 'set port')
      .argParser((val) => parseInt(val, 10))
      .default(3000),
  )
  .option('-H, --hostname <host>', 'set hostname', 'localhost')
  .action(run)

function run(options: { port: number; hostname: string }) {
  let { port, hostname } = options
  const dir = fs.realpathSync.native(path.resolve('.'))
  console.log('CWD:', dir)

  if (isNaN(port)) port = 3000

  createServer(port, hostname)
}

export default { command }
