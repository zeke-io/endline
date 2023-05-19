import { IncomingMessage, Server, ServerResponse } from 'http'
import { AppRouter, Router } from './router'
import { loadApiRoutes } from './router/router-loader'
import { EndlineConfig } from '../config'
import { getMainFile } from '../lib/project-files-resolver'
import { warn } from '../lib/logger'

interface EndlineServerOptions {
  config: EndlineConfig
  httpServer?: Server
  projectDir: string
  hostname?: string
  port?: number
  isDev?: boolean
}

export class EndlineServer {
  private readonly projectDir: string
  private config: EndlineConfig
  private appRouter: AppRouter
  private rootRouter: Router
  private isDev?: boolean
  // TODO: Refactor
  private additionalParams: Record<string, unknown> = {}

  constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = isDev
    this.appRouter = new AppRouter()
    this.rootRouter = new Router('/')
  }

  public async initialize() {
    await this.initializeMainFile()
    await this.loadRoutes()
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      /** TODO: Use {@link rootRouter} instead */
      await this.appRouter.run(req, res, this.additionalParams)
    }
  }

  private async initializeMainFile() {
    const filePath = getMainFile(this.projectDir, false)

    if (filePath == null) return

    const file = require(filePath)
    const module = file.default || file

    if (!module) {
      warn(`The main file does not export a default function, ignoring...`)
      return
    }

    this.additionalParams = (await module()) || {}
  }

  async loadRoutes(cleanRouter = false) {
    if (cleanRouter) {
      this.appRouter = new AppRouter()
    }

    /** TODO: Load routes to {@link rootRouter} instead */
    await loadApiRoutes(this.projectDir, this.appRouter, this.isDev)
  }
}
