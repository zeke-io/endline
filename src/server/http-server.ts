import http, { IncomingMessage, ServerResponse } from 'http'
import process from 'process'
import { EndlineServer } from './endline'

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
      console.error(message)
      process.exit(1)
    }

    throw err
  })

  server.on('listening', () => {
    console.log(`Server is listening on ${hostname}:${port}`)
  })

  server.listen(port, hostname)
  const app = new EndlineServer({
    httpServer: server,
    projectDir,
  })
  requestListener = app.requestListener
}
