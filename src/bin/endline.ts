#!/usr/bin/env node
import { Command } from 'commander'
import { EndlineDev, EndlineBuild } from '../cli'
import { warn } from '../lib/logger'

const program = new Command()

program.name('endline')
program.addCommand(EndlineDev.command, { isDefault: true })
program.addCommand(EndlineBuild.command)

warn(
  `This project is still in its early stages and under active development. It is not yet ready to be used in a production environment.`,
  `\nIf you'd like to contribute with code, report issues, or give suggestions, check out the project's repository: https://github.com/zeke-io/endline.`,
)
program.parse()
