import { EndlineRequiredConfig } from './config'
import { info, ready } from './lib/logger'
import {
  EndlineServer,
  EndlineServerOptions,
  RequestListener,
} from './server/endline-server'
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
    let server
    if (options.isDev) {
      server = new DevServer(options)
    } else {
      server = new EndlineServer(options)
    }

    this.endlineServer = server

    return server
  }

  public async initialize() {
    const { options } = this
    const { hostname, port } = options

    info(`Initializing server on ${hostname}:${port}`)

    this.createServer(options)
    await this.endlineServer!.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  public shutdown() {
    this.endlineServer?.shutdown()
  }

  public getRequestListener(): RequestListener {
    return this.endlineServer!.getRequestHandler()
  }
}

export default EndlineApp
