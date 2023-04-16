import http, { IncomingMessage, ServerResponse } from 'http'
import process from 'process'
import { Router } from './router'

export function createServer(port: number, hostname: string) {
  const router = new Router()
  const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => router.run(req, res),
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
}
