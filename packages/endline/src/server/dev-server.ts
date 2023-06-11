import fs from 'fs'
import path from 'path'
import { EndlineServer, EndlineServerOptions } from './base-server'
import { WatchCompiler } from '../build/rollup/watch'
import { loadEnvFiles } from '../config/env-loader'

export class DevServer extends EndlineServer {
  private watchCompiler?: WatchCompiler

  constructor(options: EndlineServerOptions) {
    super(options)
  }

  public async initialize() {
    await this.runFileWatcher()
    await super.initialize()
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
