#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { Command } from 'commander'
import prompts from 'prompts'
import validateNpmName from 'validate-npm-package-name'
import { createEndlineApp } from './lib/create-endline-app'

const program = new Command()

program
  .name('create-endline-app')
  .version(require('../package.json').version)
  .description('Create an Endline app')
  .arguments('[project-directory]')
  .option('-t, --typescript', 'use typescript')
  .action(main)
  .parse()

async function main(
  projectName: string,
  { typescript }: { typescript?: boolean },
) {
  /** Validate arguments provided, prompt required options */
  if (!projectName) {
    const response = await prompts({
      name: 'projectName',
      type: 'text',
      message: 'Name of the project',
      initial: 'my-endline-app',
      validate: (value) => {
        const { errors = [], warnings = [] } = validateNpmName(value)

        if (errors.length || warnings.length) {
          return `Invalid package name: ${[...errors, ...warnings][0]}`
        }

        return true
      },
    })

    if (response.projectName) {
      projectName = response.projectName.trim()
    }
  }

  if (typescript == null) {
    const response = await prompts({
      name: 'typescript',
      type: 'confirm',
      message: 'Do you want to use typescript?',
      initial: false,
    })

    typescript = response.typescript
  }

  // TODO: Prompt package manager selection (type: 'select' maybe?), default to npm
  const packageManager = 'npm'

  /** Prepare for installation */
  const rootDirectory = path.resolve(projectName)
  const folderExists = fs.existsSync(rootDirectory)

  if (folderExists) {
    console.log(
      chalk.yellow(
        `Cannot create a project in ${rootDirectory} because the folder already exists.`,
      ),
    )
    process.exit(1)
  }

  await createEndlineApp(projectName, {
    typescript: typescript!,
    packageManager,
  })
}
