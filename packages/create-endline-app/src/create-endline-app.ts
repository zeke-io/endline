import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import cpy from 'cpy'
import { installDependencies } from './lib/install-dependencies'

export async function createEndlineApp(projectPath: string) {
  const projectRoot = path.resolve(projectPath)
  const packageManager = 'npm'

  console.log(
    `Creating a new Endline project in ${chalk.blueBright(projectRoot)}\n`,
  )

  await createProjectFiles({
    projectPath,
    projectRoot,
    packageManager,
  })

  console.log()
  console.log(
    chalk.green(`Done! Created '${projectPath}' project at ${projectRoot}.`),
  )
  console.log()
  console.log('You can start with:')
  console.log(`  - cd ${projectPath}`)
  console.log(`  - ${packageManager} run dev`)
}

async function createProjectFiles({
  projectPath,
  projectRoot,
  packageManager,
}: {
  projectPath: string
  projectRoot: string
  packageManager: string
}) {
  /** Create directory */
  fs.mkdirSync(projectRoot, { recursive: true })

  process.chdir(projectRoot)

  /** Copy template */
  await cpy(['**'], projectRoot, {
    parents: true,
    cwd: path.join(__dirname, '..', 'template', 'javascript'),
    rename: (name) => {
      switch (name) {
        // Renaming gitignore as .gitignore (with the period) is ignored when compiled
        case 'gitignore':
          return `.${name}`
        default:
          return name
      }
    },
  })

  /** Create package.json */
  const packageJson = {
    name: projectPath,
    version: '0.0.1',
    private: true,
    scripts: {
      dev: 'endline dev',
      build: 'endline build',
    },
  }

  fs.writeFileSync(
    path.join(projectRoot, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  )

  /** Install dependencies */
  console.log(chalk.yellow(`Installing dependencies with ${packageManager}...`))
  const dependencies = ['endline']
  await installDependencies(packageManager, dependencies)
}
