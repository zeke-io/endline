import Watchpack from 'watchpack'
import { WebpackCompiler } from './compiler'
import { watch } from '../../lib/logger'

export class WatchCompiler {
  private readonly projectDir: string
  private routesDirectory: string
  private webpack: WebpackCompiler
  private wp: Watchpack

  constructor({
    projectDir,
    routesDirectory,
  }: {
    projectDir: string
    routesDirectory: string
  }) {
    this.projectDir = projectDir
    this.routesDirectory = routesDirectory
    this.webpack = new WebpackCompiler({
      projectDir,
      routesDirectory,
      clean: true,
    })

    this.wp = new Watchpack({
      ignored: ['**/.git', '**/dist/**/*'],
    })
  }

  async watch(onSuccess?: () => void) {
    await this.webpack.run()
    this.wp.watch({
      directories: [this.projectDir],
    })
    this.wp.on('aggregated', async (_changes, _removals) => {
      watch('Changes detected, applying...')
      await this.webpack.run()
      onSuccess?.()
    })
  }

  async close() {
    this.wp.close()
  }
}