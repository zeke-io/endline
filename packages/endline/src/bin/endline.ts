#!/usr/bin/env node
import { Command } from 'commander'
import { EndlineDev, EndlineBuild } from '../cli'

const program = new Command()

program
  .name('endline')
  .version(require('../../package.json').version)
  .addCommand(EndlineDev.command, { isDefault: true })
  .addCommand(EndlineBuild.command)
  .hook('preSubcommand', (_cmd, subCommand) => {
    const defaultEnv =
      subCommand.name() === 'dev' ? 'development' : 'production'

    process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv
  })
  .parse()
