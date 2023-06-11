import http from 'http'
import { EndlineRequiredConfig } from '../config'
import createEndlineApp from '../endline'
import { warn } from '../lib/logger'

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
  const server = http.createServer()
  const app = createEndlineApp(server, {
    hostname,
    port,
    projectDir,
    config,
    isDev: true,
  })

  shutdownServer = () => {
    server.close()
    app.shutdown()
  }

  await app.initialize(server)
  server.listen(port, hostname)
}
