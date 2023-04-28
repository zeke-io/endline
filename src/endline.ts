import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineConfig } from './server/config'
import { error, info, ready, watch } from './lib/logger'
import process from 'process'
import { EndlineServer } from './server/endline'
import { WatchCompiler } from './server/build/watch-compiler'

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
  private readonly isDev: boolean
  private hostname: string
  private port: number
  private endlineServer: EndlineServer
  private watchCompiler?: WatchCompiler

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

    this.endlineServer = new EndlineServer({ config, projectDir, isDev })
  }

  public async initialize() {
    const { hostname, port, httpServer, endlineServer } = this
    info(`Initializing server on ${hostname}:${port}`)

    if (this.isDev) {
      await this.runWatchCompiler()
    }

    httpServer.addListener('request', this.requestListener)
    await endlineServer.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  private async runWatchCompiler() {
    const { projectDir, config } = this

    this.watchCompiler = new WatchCompiler({ projectDir, config })
    await this.watchCompiler.watch((changes, removals) => {
      watch('Changes detected, applying...')
      // TODO: Apply changes
    })
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.endlineServer.requestListener(req, res)
    }
  }

  public shutdown() {
    this.watchCompiler?.close()
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
