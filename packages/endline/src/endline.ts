import path from 'path'
import process from 'process'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { EndlineConfig } from './config'
import { error, info, ready } from './lib/logger'
import { EndlineServer } from './server/endline-server'
import { Watch } from './server/build/webpack/watch'
import { RollupWatchCompiler } from './server/build/rollup/watch'
import { findDirectory } from './lib/directory-resolver'

interface EndlineAppOptions {
  config: EndlineConfig
  httpServer: Server
  projectDir: string
  hostname: string
  port: number
  isDev?: boolean
  useRollup: boolean
}

class EndlineApp {
  private config: EndlineConfig
  private httpServer: Server
  private projectDir: string
  private readonly isDev: boolean
  private hostname: string
  private port: number
  private endlineServer: EndlineServer
  private watchCompiler?: Watch | RollupWatchCompiler
  private useRollup: boolean

  constructor({
    config,
    httpServer,
    projectDir,
    hostname,
    port,
    isDev,
    useRollup,
  }: EndlineAppOptions) {
    this.config = config
    this.httpServer = httpServer
    this.projectDir = projectDir
    this.hostname = hostname
    this.port = port
    this.isDev = !!isDev
    this.useRollup = useRollup

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
    const { projectDir, config, useRollup } = this

    if (!useRollup) {
      const routesDirectory =
        findDirectory(projectDir, config.router.routesDirectory, false) ||
        path.join(projectDir, 'src/routes')

      this.watchCompiler = new Watch({ projectDir, routesDirectory })
      await this.watchCompiler.watch(() => {
        this.endlineServer.loadRoutes(true)
      })
    } else {
      const outputPath = path.join(projectDir, config.distDir)
      this.watchCompiler = new RollupWatchCompiler()
      await this.watchCompiler.initialize(projectDir, outputPath, () => {
        this.endlineServer.loadRoutes(true)
      })
    }
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
