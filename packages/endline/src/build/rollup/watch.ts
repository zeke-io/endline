import rollup, { RollupWatcher } from 'rollup'
import { createOptions } from './options'
import { build } from './index'
import { watch } from '../../lib/logger'

export class RollupWatchCompiler {
  private watcher?: RollupWatcher

  public async initialize(
    projectDir: string,
    { distFolder, typescript }: { distFolder: string; typescript: boolean },
    onSuccess: () => void,
  ) {
    const { inputOptions, outputOptions } = await createOptions(
      projectDir,
      distFolder,
      typescript,
    )

    await build(projectDir, { distFolder, typescript })

    this.watcher = rollup.watch({
      ...inputOptions,
      output: outputOptions,
    })

    this.watcher.on('change', async (_id, _event) => {
      watch('Detected changes! Reloading...')
      await build(projectDir, { distFolder, typescript })
      onSuccess()
    })
  }

  public close() {
    this.watcher?.close()
  }
}
