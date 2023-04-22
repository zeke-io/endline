import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineConfig } from './server/config'
import { error, info, ready } from './lib/logger'
import process from 'process'
import { EndlineServer } from './server/endline'

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
  private endlineServer: EndlineServer

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

    this.endlineServer = new EndlineServer({ config, projectDir })
  }

  public async initialize() {
    const { hostname, port, httpServer, endlineServer } = this
    info(`Initializing server on ${hostname}:${port}`)

    httpServer.addListener('request', this.requestListener)
    await endlineServer.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.endlineServer.requestListener(req, res)
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
