import http, { IncomingMessage, ServerResponse } from 'http'
import process from 'process'
import { EndlineServer } from './endline'
import { error, info, ready } from '../lib/logger'
import { EndlineConfig } from './config'

let requestListener: (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> = async (_req: IncomingMessage, _res: ServerResponse) => {
  throw new Error('Request listener not implemented!')
}

export async function createServer({
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
  const server = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) =>
      await requestListener(req, res),
  )

  server.on('error', (err: NodeJS.ErrnoException) => {
    let message

    switch (err.code) {
      case 'EADDRINUSE':
        message = `Could not start server on ${hostname}:${port} because the port is already in use!`
        break
      case 'EACCES':
        message = `Could not start server on ${hostname}:${port} because you don't have access to the port!`
        break
    }

    if (message) {
      error(message)
      process.exit(1)
    }

    throw err
  })

  server.on('listening', () => {
    info(`Starting server on ${hostname}:${port}`)
  })

  server.listen(port, hostname)
  const app = new EndlineServer({
    httpServer: server,
    projectDir,
    config,
  })
  requestListener = app.requestListener
  await app.initialize()

  ready(`Server is ready and listening on ${hostname}:${port}`)
}
