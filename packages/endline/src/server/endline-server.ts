import { IncomingMessage, Server, ServerResponse } from 'http'
import { Router } from './router'
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
  // private appRouter: AppRouter
  private rootRouter: Router
  private isDev?: boolean
  // TODO: Refactor
  private additionalParams: Record<string, unknown> = {}

  constructor({ projectDir, config, isDev }: EndlineServerOptions) {
    this.projectDir = projectDir
    this.config = config
    this.isDev = isDev
    this.rootRouter = new Router('/')
    // this.appRouter = new AppRouter()
  }

  public async initialize() {
    await this.initializeMainFile()
    await this.loadRoutes()
  }

  get requestListener() {
    return async (req: IncomingMessage, res: ServerResponse) => {
      await this.rootRouter.run(req, res, {
        ...this.additionalParams,
      })

      // await this.appRouter.run(req, res, this.additionalParams)
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
    // This does not work, and will be updated after new routing implementation
    // TODO: Look for a way to "clear" the router
    if (cleanRouter) {
      // this.appRouter = new AppRouter()
    }

    await loadApiRoutes(this.projectDir, this.rootRouter, this.isDev)
  }
}
