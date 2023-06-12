import fs from 'fs'
import path from 'path'
import dotenv, { DotenvConfigOutput } from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { error } from '../lib/logger'

export async function loadEnvFiles(rootDir: string) {
  const envName = process.env.NODE_ENV
  const foundEnvs = []
  const envFiles = ['.env.local', '.env']

  // Make sure `.env.{environment}*` files load first
  if (envName) envFiles.unshift(`.env.${envName}.local`, `.env.${envName}`)

  for (const fileName of envFiles) {
    try {
      const filePath = path.join(rootDir, fileName)
      const stat = fs.lstatSync(filePath)

      // If it is not a file, ignore it
      if (!stat.isFile()) continue

      const contents = fs.readFileSync(filePath, 'utf-8')
      foundEnvs.push({
        name: fileName,
        path: filePath,
        contents,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Ignore ENOENT error code to ignore .env files that do not exists
      if (e.code !== 'ENOENT') {
        error(`Could not load env file '${fileName}'.`)
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
