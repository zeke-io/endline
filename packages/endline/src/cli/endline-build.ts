import { Command } from 'commander'
import { getProjectDirectory } from '../lib/directory-resolver'
import loadConfig from '../config'
import build from '../build'

const command = new Command('build')
  .description('Compiles the Endline app for production')
  .option('-d, --directory <path>', 'set the root directory of the project')
  // Temporarily disable webpack and use rollup as default
  //.option('-r, --use-rollup', 'use rollup as compiler', false)
  .action(run)

async function run(options: { directory?: string; useRollup: boolean }) {
  const { directory, useRollup = true } = options

  const projectDir = getProjectDirectory(directory)

  const config = await loadConfig({ projectDir })
  await build({ projectDir, config, useRollup })
}

export default { command }
