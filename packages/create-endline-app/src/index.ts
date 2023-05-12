#!/usr/bin/env node
import { Command } from 'commander'
import prompts from 'prompts'
import validateNpmName from 'validate-npm-package-name'
import { createEndlineApp } from './create-endline-app'

const program = new Command()

program
  .name('create-endline-app')
  .version('0.0.1')
  .description('Create an Endline App')
  .arguments('[project-directory]')
  .action(main)
  .parse()

async function main(projectName: string) {
  /** Validate arguments provided, prompt required options */
  if (!projectName) {
    const response = await prompts({
      name: 'projectName',
      type: 'text',
      message: 'Name of the project',
      initial: 'endline-api',
      validate: (value) => {
        const { errors = [], warnings = [] } = validateNpmName(value)

        if (errors?.length || warnings?.length) {
          return `Invalid package name: ${[...errors, ...warnings][0]}`
        }

        return true
      },
    })

    if (response.projectName) {
      projectName = response.projectName.trim()
    }
  }

  await createEndlineApp(projectName)
}
