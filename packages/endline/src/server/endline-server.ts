import fs from 'fs'
import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import {
  EndlineServer,
  RequestListener,
  EndlineServerOptions,
} from './base-server'
import { AppRouter } from './router'
import { loadApiRoutes } from './router/router-loader'
import { findAppFile } from '../lib/project-files-resolver'
import { error, warn } from '../lib/logger'
import { WatchCompiler } from '../build/rollup/watch'
import { loadEnvFiles } from '../config/env-loader'

export class DevServer extends EndlineServer {
  private watchCompiler?: WatchCompiler
  private router: AppRouter
  private additionalContextItems?: Record<string, unknown>

  constructor(options: EndlineServerOptions) {
    super(options)

    this.router = new AppRouter()
  }

  public async initialize() {
    await this.initializeMainFile()
    await this.loadRoutes(true)
  }

  public getRequestHandler(): RequestListener {
    return this.handleRequest.bind(this)
  }

  public async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      await this.router.run(req, res, this.additionalContextItems || {})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      error(`An error has occurred on request [${req.method} ${req.url}]:`)
      console.error(e)

      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 500, message: e.message }))
    }
  }

  private async initializeMainFile() {
    const filePath = findAppFile(this.projectDir, this.config.distDir)

    // Clear the additional context items if the app file is not valid
    if (filePath == null) {
      this.additionalContextItems = {}
      return
    }

    const file = require(filePath)
    delete require.cache[filePath]
    const module = file.default || file

    if (!module || typeof module !== 'function') {
      warn(`The main file does not export a default function, ignoring...`)
      return
    }

    const additionalContextItems = (await module()) || {}

    // It is only valid if the returned object type is null, undefined or a 'Record<string, unknown>' object
    if (
      additionalContextItems != null &&
      typeof additionalContextItems !== 'object'
    ) {
      warn(
        `The main function is returning a value of type "${typeof additionalContextItems}" when it should return an object, undefined or null.`,
      )
      return
    }

    this.additionalContextItems = additionalContextItems
  }

  async loadRoutes(cleanRouter = false) {
    if (cleanRouter) {
      this.router = new AppRouter()
    }

    await loadApiRoutes(
      this.projectDir,
      this.config.distDir,
      this.router,
      this.isDev,
    )
  }

  private async runFileWatcher() {
    const { projectDir, config } = this
    const outputPath = path.join(projectDir, config.distDir)

    const typescriptConfig = path.join(projectDir, 'tsconfig.json')
    const usingTypescript = fs.existsSync(typescriptConfig)

    const envFiles = [
      '.env.development.local',
      '.env.development',
      '.env.local',
      '.env',
    ].map((e) => path.join(projectDir, e))

    const watchTimes = new Map<string, number>()

    this.watchCompiler = new WatchCompiler()
    await this.watchCompiler.initialize(
      projectDir,
      { distFolder: outputPath, typescript: usingTypescript },
      (entries) => {
        let envChanged = false

        for (const [fileName, entry] of entries) {
          const watchTimeEntry = watchTimes.get(fileName)
          const fileChanged: boolean =
            !!watchTimeEntry && watchTimeEntry !== entry.timestamp
          watchTimes.set(fileName, entry.timestamp)

          if (envFiles.includes(fileName) && fileChanged) {
            envChanged = true
            // noinspection UnnecessaryContinueJS
            continue
          }
        }

        if (envChanged) {
          loadEnvFiles(projectDir)
        }

        // TODO: Refactor
        this.initialize()
      },
    )
  }

  public shutdown() {
    this.watchCompiler?.close()
  }
}
