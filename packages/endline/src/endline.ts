import fs from 'fs'
import path from 'path'
import process from 'process'
import { Server } from 'http'
import { EndlineRequiredConfig } from './config'
import { error, info, ready } from './lib/logger'
import { EndlineServer } from './server/endline-server'
import { WatchCompiler } from './build/rollup/watch'

interface EndlineAppOptions {
  config: EndlineRequiredConfig
  httpServer: Server
  projectDir: string
  hostname: string
  port: number
  isDev?: boolean
  useRollup?: boolean
}

class EndlineApp {
  private config: EndlineRequiredConfig
  private httpServer: Server
  private projectDir: string
  private readonly isDev: boolean
  private hostname: string
  private port: number
  private endlineServer: EndlineServer
  private watchCompiler?: WatchCompiler
  private useRollup: boolean

  constructor({
    config,
    httpServer,
    projectDir,
    hostname,
    port,
    isDev,
    useRollup = true,
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

    httpServer.addListener('request', this.endlineServer.getRequestHandler())
    await endlineServer.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  private async runWatchCompiler() {
    const { projectDir, config } = this

    const outputPath = path.join(projectDir, config.distDir)

    const typescriptConfig = path.join(projectDir, 'tsconfig.json')
    const useTypescript = fs.existsSync(typescriptConfig)

    this.watchCompiler = new WatchCompiler()
    await this.watchCompiler.initialize(
      projectDir,
      { distFolder: outputPath, typescript: useTypescript },
      (_files) => {
        /*for (const [fileName] of files) {
          // TODO: Load env files if they were changed
        }*/

        // TODO: Refactor
        this.endlineServer.initialize()
      },
    )
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
