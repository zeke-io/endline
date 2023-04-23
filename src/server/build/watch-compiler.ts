import { EndlineConfig } from '../config'
import Watchpack from 'watchpack'

export class WatchCompiler {
  private readonly projectDir: string
  private config: EndlineConfig
  private wp: Watchpack

  constructor({
    projectDir,
    config,
  }: {
    projectDir: string
    config: EndlineConfig
  }) {
    this.projectDir = projectDir
    this.config = config
    this.wp = new Watchpack({
      ignored: '**/.git',
    })
  }
  async watch(onAggregated: (changes: any, removals: any) => void) {
    this.wp.watch({
      directories: [this.projectDir],
    })
    this.wp.on('aggregated', onAggregated)
    /*return wp.watch({}, (err, stats) => {
      if (err) {
        console.error(err)
        return
      }

      // info(`Changes detected, applying changes... [${stats?.hash}]`)
    })*/
  }
  async close() {
    this.wp.close()
  }
}
