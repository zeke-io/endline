#!/usr/bin/env node
import { Command } from 'commander'
import { EndlineDev } from '../cli'

const program = new Command()

program.name('endline')
program.addCommand(EndlineDev.command, { isDefault: true })

program.parse()
