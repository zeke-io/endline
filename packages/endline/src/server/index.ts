import http from 'http'
import { EndlineConfig } from '../config'
import createEndlineApp from '../endline'
import { warn } from '../lib/logger'

// Gracefully shutdown server
let serverShutdown: () => void
function shutdownHandler() {
  console.log('')
  warn('Shutting down server...')
  serverShutdown()
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
  config: EndlineConfig
}) {
  const server = http.createServer()
  const app = createEndlineApp({
    httpServer: server,
    hostname,
    port,
    projectDir,
    config,
    isDev: true,
  })

  serverShutdown = () => {
    server.close()
    app.shutdown()
  }

  server.listen(port, hostname, async () => await app.initialize())
}
