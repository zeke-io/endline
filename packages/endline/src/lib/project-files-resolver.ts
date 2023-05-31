import fs from 'fs'
import path from 'path'
import { warn } from './logger'

export function findAppFile(projectDir: string, distDir: string) {
  const appFilePath = path.join(projectDir, distDir, 'app.js')

  if (!fs.existsSync(appFilePath)) return null

  const stat = fs.lstatSync(appFilePath)
  if (!stat.isFile()) return null

  return appFilePath
}

export function getRouteFiles(routesDir: string, extensions = ['.js']) {
  if (!fs.existsSync(routesDir)) {
    warn(`The routes directory at '${routesDir}' does not exist.`)
    return []
  }

  const filesInDir = fs.readdirSync(routesDir)
  const foundFiles = []

  for (const fileName of filesInDir) {
    const filePath = path.join(routesDir, fileName)
    const stat = fs.lstatSync(filePath)

    /** Filter out folders */
    if (!stat.isFile()) continue

    /** Filter out files without the given {@link extensions} */
    if (!extensions.includes(path.extname(filePath))) continue

    foundFiles.push({
      fileName: fileName,
      path: filePath,
      module,
    })
  }

  return foundFiles
}
