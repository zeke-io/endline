import http, { IncomingMessage, ServerResponse } from 'http'
import { error } from './logger'
import { EndlineRequiredConfig } from '../config'
import createEndlineApp from '../endline'

export async function initializeApp({
  hostname,
  port,
  isDev,
  projectDir,
  config,
}: {
  hostname: string
  port: number
  isDev: boolean
  projectDir: string
  config: EndlineRequiredConfig
}) {
  let requestListener = async (
    _req: IncomingMessage,
    _res: ServerResponse,
  ): Promise<void> => {
    throw new Error('Request listener was not set up')
  }

  const server = http.createServer(async (req, res) => {
    try {
      await requestListener(req, res)
    } catch (e) {
      res.writeHead(500)
      res.end('Internal Server Error')
      error(`An error has occurred on request [${req.method} ${req.url}]:`)
      console.error(e)
    }
  })

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

  server.listen(port, hostname)

  const app = createEndlineApp(server, {
    hostname,
    port,
    projectDir,
    isDev,
    config,
  })
  await app.initialize()
  requestListener = app.getRequestListener()

  return () => {
    app.shutdown()
    server.close()
  }
}
