#!/usr/bin/env node
import { Command } from 'commander'

const program = new Command()

program
  .name('create-endline-app')
  .version('0.0.1')
  .description('Create an Endline App')
  .argument('[name]', 'name of the project')

program.parse()
