import process from 'process'
import { Server } from 'http'
import { EndlineRequiredConfig } from './config'
import { error, info, ready } from './lib/logger'
import { EndlineServer, EndlineServerOptions } from './server/base-server'
import { DevServer } from './server/dev-server'

interface EndlineAppOptions {
  config: EndlineRequiredConfig
  projectDir: string
  hostname: string
  port: number
  isDev?: boolean
}

class EndlineApp {
  private options: EndlineAppOptions
  private endlineServer?: EndlineServer

  constructor(options: EndlineAppOptions) {
    this.options = options
  }

  public createServer(options: EndlineServerOptions) {
    const server = new DevServer(options)
    this.endlineServer = server

    return server
  }

  public async initialize(httpServer: Server) {
    const { options } = this
    const { hostname, port } = options

    info(`Initializing server on ${hostname}:${port}`)

    this.createServer(options)

    httpServer.addListener('request', this.endlineServer!.getRequestHandler())
    await this.endlineServer!.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  public shutdown() {
    this.endlineServer?.shutdown()
  }
}

export function createEndlineApp(
  httpServer: Server,
  options: EndlineAppOptions,
) {
  const { hostname, port } = options

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

  return new EndlineApp(options)
}

export default createEndlineApp

module.exports = createEndlineApp
exports = module.exports
