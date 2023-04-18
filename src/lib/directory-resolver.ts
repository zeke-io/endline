import fs from 'fs'
import path from 'path'

export function getProjectDirectory(directory?: string) {
  return fs.realpathSync.native(path.resolve(directory || '.'))
}

export function findDirectory(
  directory: string,
  folderPath: string,
  fromSrc = true,
) {
  const newPath = [fromSrc && 'src', folderPath].filter(Boolean).map(String)
  const currentDirectory = path.join(directory, ...newPath)

  if (fs.existsSync(currentDirectory)) return currentDirectory

  return null
}
