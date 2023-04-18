import path from 'path'
import { pathToFileURL } from 'url'
import { error, warn } from '../../lib/logger'
import { validateConfig } from './config-schema'
import { RouterConfig } from '../router'
import fs from 'fs'

export interface EndlineConfig {
  router: RouterConfig
}

const defaultConfig: EndlineConfig = {
  router: {
    apiFolderPath: 'src/api',
  },
}

export default async function loadConfig(dir: string): Promise<EndlineConfig> {
  const fileName = 'endline.config.js'
  const filePath = path.resolve(dir, fileName)
  const fileExist = fs.existsSync(filePath)

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

  warn(`Could not find configuration file, using default configuration.`)

  return defaultConfig
}