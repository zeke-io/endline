import fs from 'fs'
import path from 'path'

export function getProjectDirectory(directory?: string) {
  return fs.realpathSync.native(path.resolve(directory || '.'))
}

export function findDirectory(directory: string, name: string) {
  const currentDirectory = path.join(directory, 'src', name)

  if (fs.existsSync(currentDirectory)) return currentDirectory

  return null
}
