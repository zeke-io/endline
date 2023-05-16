import rollup, { RollupWatcher } from 'rollup'
import { createOptions } from './options'
import { build } from './index'

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

    this.watcher.on('change', (_id, _event) => {
      onSuccess()
    })
  }

  public close() {
    this.watcher?.close()
  }
}
