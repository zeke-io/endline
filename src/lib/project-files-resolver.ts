import fs from 'fs'
import path from 'path'

export function getRouteFiles(routesDir: string, extensions = ['.js']) {
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
