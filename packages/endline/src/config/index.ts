import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { error, warn } from '../lib/logger'
import { validateConfig } from './config-schema'
import { loadEnvFiles } from './env-loader'
import {
  defaultConfig,
  EndlineConfig,
  EndlineRequiredConfig,
} from './config-shared'

export { EndlineConfig, EndlineRequiredConfig }

export async function loadConfigurationFile(
  rootDir: string,
): Promise<EndlineRequiredConfig> {
  const fileName = 'endline.config.js'
  const filePath = path.resolve(rootDir, fileName)

  if (fs.existsSync(filePath)) {
    const userConfigFile = await import(pathToFileURL(filePath).href)
    const userConfig = userConfigFile.default || userConfigFile

    if (Object.keys(userConfig).length === 0) {
      warn(
        `Configuration file '${fileName}' is not exporting a valid configuration.`,
      )
    }

    const validation = validateConfig(userConfig)
    if (validation.errors) {
      error(`Configuration file '${fileName}' is invalid:`)
      validation.errors.forEach((e) => error(` · ${e}`))

      process.exit(1)
    }

    return {
      ...defaultConfig,
      ...userConfig,
    }
  }

  // Silently use default config if no configuration file was found.
  return defaultConfig
}

export default async function loadConfig(
  rootDir: string,
): Promise<EndlineRequiredConfig> {
  // Load env files first, so they are available in the config file
  await loadEnvFiles(rootDir)

  return await loadConfigurationFile(rootDir)
}
