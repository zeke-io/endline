import path from 'path'
import { pathToFileURL } from 'url'
import { error, warn } from '../../lib/logger'
import { validateConfig } from './config-schema'
import { RouterConfig } from '../router'
import fs from 'fs'
import { loadEnvFiles } from './env-loader'

export interface EndlineConfig {
  distDir: string
  router: RouterConfig
}

const defaultConfig: EndlineConfig = {
  distDir: './dist',
  router: {
    routesDirectory: 'src/routes',
  },
}

export default async function loadConfig({
  projectDir,
  environment,
}: {
  projectDir: string
  environment?: string
}): Promise<EndlineConfig> {
  const fileName = 'endline.config.js'
  const filePath = path.resolve(projectDir, fileName)
  const fileExist = fs.existsSync(filePath)

  await loadEnvFiles({ projectDir, environment })

  if (fileExist) {
    const userConfigFile = await import(pathToFileURL(filePath).href)
    const userConfig = userConfigFile.default || userConfigFile

    if (Object.keys(userConfig).length === 0) {
      warn(
        `Configuration file '${fileName}' detected, but no configuration has been exported.`,
      )
    }

    const validation = validateConfig(userConfig)
    if (validation.errors) {
      error(`Configuration file '${fileName}' invalid:`)
      validation.errors.forEach((e) => error(` · ${e}`))

      process.exit(1)
    }

    /**
     * TODO: Find a better way to populate missing configuration
     * if the user configuration makes one object property undefined: { router: undefined }
     * then it should add missing required properties to that object: { router: { ... } }
     */
    return {
      ...defaultConfig,
      ...userConfig,
    }
  }

  /**
   * Silently use default config if no configuration file has been found.
   */
  return defaultConfig
}
