import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineConfig } from './server/config'
import { error, info, ready } from './lib/logger'
import process from 'process'

interface EndlineAppOptions {
  config: EndlineConfig
  httpServer: Server
  projectDir: string
  hostname: string
  port: number
  isDev?: boolean
}

class EndlineApp {
  private config: EndlineConfig
  private httpServer: Server
  private projectDir: string
  private isDev: boolean
  private hostname: string
  private port: number

  constructor({
    config,
    httpServer,
    projectDir,
    hostname,
    port,
    isDev,
  }: EndlineAppOptions) {
    this.config = config
    this.httpServer = httpServer
    this.projectDir = projectDir
    this.hostname = hostname
    this.port = port
    this.isDev = !!isDev
  }

  public async initialize() {
    const { hostname, port, httpServer } = this
    info(`Initializing server on ${hostname}:${port}`)

    httpServer.addListener('request', this.requestListener)

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      res.statusCode = 200
      res.end('Hello world')
    }
  }
}

export function createEndlineApp({
  httpServer,
  hostname,
  port,
  ...options
}: EndlineAppOptions) {
  httpServer.on('error', (err: NodeJS.ErrnoException) => {
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

  return new EndlineApp({ httpServer, hostname, port, ...options })
}

export default createEndlineApp

module.exports = createEndlineApp
exports = module.exports
