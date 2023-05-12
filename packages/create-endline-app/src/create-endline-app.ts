import * as path from 'path'
import chalk from 'chalk'

export async function createEndlineApp(projectPath: string) {
  const projectRoot = path.resolve(projectPath)
  const packageManager = 'npm'

  console.log(`Creating new Endline project in ${projectRoot}\n`)

  /** TODO: Generate project */

  console.log(
    chalk.green(`Done! Created '${projectPath}' project at ${projectRoot}.`),
  )
  console.log()
  console.log('You can start with:')
  console.log(`  - cd ${projectRoot}`)
  console.log(`  - ${packageManager} dev`)
}
