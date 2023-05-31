import fs from 'fs'
import path from 'path'
import process from 'process'
import { Server } from 'http'
import { EndlineRequiredConfig } from './config'
import { error, info, ready } from './lib/logger'
import { EndlineServer } from './server/endline-server'
import { WatchCompiler } from './build/rollup/watch'
import { loadEnvFiles } from './config/env-loader'

interface EndlineAppOptions {
  config: EndlineRequiredConfig
  httpServer: Server
  projectDir: string
  hostname: string
  port: number
  isDev?: boolean
}

class EndlineApp {
  private config: EndlineRequiredConfig
  private httpServer: Server
  private rootDir: string
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
    this.rootDir = projectDir
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

    httpServer.addListener('request', this.endlineServer.getRequestHandler())
    await endlineServer.initialize()

    ready(`Server is ready and listening on ${hostname}:${port}`)
  }

  private async runWatchCompiler() {
    const { rootDir, config } = this

    const outputPath = path.join(rootDir, config.distDir)

    const typescriptConfig = path.join(rootDir, 'tsconfig.json')
    const useTypescript = fs.existsSync(typescriptConfig)

    const envName = process.env.NODE_ENV
    const envFiles = ['.env.local', '.env'].map((e) => path.join(rootDir, e))
    if (envName) envFiles.unshift(`.env.${envName}.local`, `.env.${envName}`)

    this.watchCompiler = new WatchCompiler()
    await this.watchCompiler.initialize(
      rootDir,
      { distFolder: outputPath, typescript: useTypescript },
      (files) => {
        let envChanged = false

        for (const [fileName] of files) {
          if (envFiles.includes(fileName)) {
            envChanged = true
            // noinspection UnnecessaryContinueJS
            continue
          }
        }

        if (envChanged) {
          loadEnvFiles(rootDir)
        }

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
