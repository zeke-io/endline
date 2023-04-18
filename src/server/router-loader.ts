import fs from 'fs'
import path from 'path'
import process from 'process'
import { pathToFileURL } from 'url'
import { AppRouter, Router, RouterConfig } from './router'
import { findDirectory } from '../lib/directory-resolver'
import { error, info, warn } from '../lib/logger'

// TODO: Add ES6 and typescript support
async function findRouters(routesDir: string) {
  const filesInDir = fs.readdirSync(routesDir)
  const foundFiles = []

  for (const fileName of filesInDir) {
    const filePath = path.join(routesDir, fileName)
    const stat = fs.lstatSync(filePath)

    /**
     * Filter out folders
     */
    if (!stat.isFile()) continue

    /**
     * Filter out files with extensions that are not .js
     */
    if (path.extname(filePath) !== '.js') continue

    /**
     * Get exported router
     */
    try {
      const file = await import(pathToFileURL(filePath).href)
      const module = file.default || file

      if (!module) {
        warn(`The file ${fileName} does not export a function`)
        continue
      }

      foundFiles.push({
        fileName: fileName,
        path: filePath,
        module,
      })
    } catch (e) {
      error(`Failed to load file ${fileName}`)
      throw e
    }
  }

  if (!foundFiles.length) {
    warn(`Could not find any files that export a function.`)
  }

  return foundFiles
}

export async function loadApiRoutes(
  projectDir: string,
  appRouter: AppRouter,
  routerConfig: RouterConfig,
) {
  const folderPath = routerConfig.apiFolderPath
  const routesDir = findDirectory(projectDir, folderPath || 'api', !folderPath)

  if (routesDir == null) {
    error(
      `Could not find folder '${folderPath}' in directory '${path.join(
        projectDir,
        routesDir || '.',
      )}'.`,
    )
    process.exit(1)
  }

  const foundRouters = await findRouters(routesDir)
  const routers: Router[] = []

  for (const routeFile of foundRouters) {
    const module = routeFile.module
    const name = path.parse(routeFile.path).name
    let router: Router

    if (typeof module === 'function') {
      router = new Router(name)
      await module(router)

      /** Add endpoints to app router */
      appRouter.addFromRouter(router)
    } else {
      warn(
        `The file '${routeFile.fileName}' does not export a default function, ignoring...`,
      )
      continue
    }

    info(`Router '${router.name}' has been loaded`)
  }

  return routers
}
