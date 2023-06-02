import Watchpack from 'watchpack'
import { build } from './index'
import { watch } from '../../lib/logger'

export class WatchCompiler {
  private watchpack?: Watchpack

  public async initialize(
    projectDir: string,
    { distFolder, typescript }: { distFolder: string; typescript: boolean },
    onSuccess: (
      timeInfoEntries: Map<string, { safeTime: number; timestamp: number }>,
    ) => void,
  ) {
    await build(projectDir, { distFolder, typescript, isDev: true })

    this.watchpack = new Watchpack({
      ignored: ['**/.git', '**/dist/**/*'],
    })

    this.watchpack.on('aggregated', async () => {
      watch('Detected changes! Reloading...')
      await build(projectDir, { distFolder, typescript, isDev: true })
      onSuccess(this.watchpack!.getTimeInfoEntries())
    })

    this.watchpack.watch({
      directories: [projectDir],
    })
  }

  public close() {
    this.watchpack?.close()
  }
}
