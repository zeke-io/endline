import fs from 'fs'
import path from 'path'
import process from 'process'
import { pathToFileURL } from 'url'
import { AppRouter, Router } from './router'
import { findDirectory } from './directory-resolver'

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
        console.warn(`The file ${fileName} does not export a router`)
        continue
      }

      foundFiles.push({
        fileName: fileName,
        path: filePath,
        module,
      })
    } catch (e) {
      console.error(`Failed to load file ${fileName}`)
      throw e
    }
  }

  if (!foundFiles.length) {
    console.warn(`Could not find any files that export a router.`)
  }

  return foundFiles
}

export async function loadApiRoutes(
  projectDir: string,
  appRouter: AppRouter,
  routesFolderName = 'api',
) {
  const routesDir = findDirectory(projectDir, routesFolderName)
  if (routesDir == null) {
    console.error(
      `Could not find folder '${routesFolderName}' in directory '${path.join(
        projectDir,
        'src',
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
      console.warn(
        `File ${routeFile.fileName} does not export a default function, ignoring...`,
      )
      continue
    }

    console.info(`Router ${routeFile.fileName} has been loaded!`)
  }

  return routers
}
