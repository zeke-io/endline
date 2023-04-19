import http, { IncomingMessage, ServerResponse } from 'http'
import process from 'process'
import { EndlineServer } from './endline'
import { error, info, ready } from '../lib/logger'
import loadConfig from './config'

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
}: {
  port: number
  hostname: string
  projectDir: string
}) {
  const config = await loadConfig(projectDir)
  info(`Starting server on ${hostname}:${port}`)
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  server.on('listening', () => {})

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
