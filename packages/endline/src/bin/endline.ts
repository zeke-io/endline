#!/usr/bin/env node
import { Command } from 'commander'
import { EndlineDev, EndlineBuild } from '../cli'

const program = new Command()

program
  .name('endline')
  .version(require('../../package.json').version)
  .addCommand(EndlineDev.command, { isDefault: true })
  .addCommand(EndlineBuild.command)
  .parse()
