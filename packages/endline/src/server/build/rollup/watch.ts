import rollup, { RollupWatcher } from 'rollup'
import { createOptions } from './'

export class RollupWatchCompiler {
  private watcher?: RollupWatcher

  public async initialize(
    projectDir: string,
    distFolder: string,
    onSuccess: () => void,
  ) {
    const { inputOptions, outputOptions } = await createOptions(
      projectDir,
      distFolder,
    )
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
