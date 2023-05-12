#!/usr/bin/env node
import { Command } from 'commander'
import prompts from 'prompts'

const program = new Command()

program
  .name('create-endline-app')
  .version('0.0.1')
  .description('Create an Endline App')
  .argument('[name]', 'name of the project')
  .action(main)

program.parse()

async function main(name: string) {
  /** Validate arguments provided, prompt required options */
  if (!name) {
    const response = await prompts({
      name: 'name',
      type: 'text',
      message: 'Name of the project',
      initial: 'endline-api',
      validate: (value) => (value ? true : 'Invalid project name'),
    })

    if (response.name) {
      name = response.name.trim()
    }
  }
}
