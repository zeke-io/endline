import { EndlineRequiredConfig } from '../config'
import { warn } from '../lib/logger'
import { initializeApp } from '../lib/initialize-app'

// Gracefully shutdown server
let shutdownServer: () => void
function shutdownHandler() {
  console.log('')
  warn('Shutting down server...')
  shutdownServer()
  process.exit(0)
}

process.on('SIGTERM', shutdownHandler)
process.on('SIGINT', shutdownHandler)

export async function initializeDevServer({
  port,
  hostname,
  projectDir,
  config,
}: {
  port: number
  hostname: string
  projectDir: string
  config: EndlineRequiredConfig
}) {
  shutdownServer = await initializeApp({
    hostname,
    port,
    config,
    projectDir,
    isDev: true,
  })
}
