import fs from 'fs'
import path from 'path'
import { Command } from 'commander'

const command = new Command('dev')
  .description('Starts a development server')
  .action(run)

function run() {
  console.log('Hello from dev command!')

  const dir = fs.realpathSync.native(path.resolve('.'))
  console.log('CWD:', dir)
}

export default { command }
