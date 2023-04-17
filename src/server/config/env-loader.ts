import path from 'path'
import fs from 'fs'
import dotenv, { DotenvConfigOutput } from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { error } from '../../lib/logger'

export async function loadEnvFiles({
  projectDir,
  environment,
}: {
  projectDir: string
  environment?: string
}) {
  const foundEnvs = []
  const envFiles = ['.env.local', '.env']

  // Make sure `.env.{environment}*` files load first if environment is set
  if (environment)
    envFiles.unshift(`.env.${environment}.local`, `.env.${environment}`)

  for (const fileName of envFiles) {
    try {
      const filePath = path.join(projectDir, fileName)
      const stat = fs.lstatSync(filePath)

      // If it is not a file, ignore it
      if (!stat.isFile()) continue

      const contents = fs.readFileSync(filePath, 'utf-8')
      foundEnvs.push({
        name: fileName,
        path: filePath,
        contents,
      })
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.code !== 'ENOENT') {
        error(`Could not load env file ${fileName}`)
        console.error(e)
      }
    }
  }

  // Expand with dotenv-expand
  for (const envFile of foundEnvs) {
    let env: DotenvConfigOutput = {}
    env.parsed = dotenv.parse(envFile.contents)
    env = dotenvExpand(env)
  }
}
