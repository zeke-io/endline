import { spawn } from 'cross-spawn'

export function installDependencies(
  packageManager: string,
  dependencies: string[],
): Promise<number | void> {
  return new Promise((resolve, reject) => {
    const child = spawn(packageManager, ['install', ...dependencies], {
      stdio: 'inherit',
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(code)
        return
      }

      resolve()
    })
  })
}
