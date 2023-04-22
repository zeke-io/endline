import http from 'http'
import { EndlineConfig } from './config'
import createEndlineApp from '../endline'

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

  server.listen(port, hostname, async () => await app.initialize())
}
