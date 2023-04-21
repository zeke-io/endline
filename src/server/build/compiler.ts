import webpack, { Configuration, StatsError } from 'webpack'
import { EndlineConfig } from '../config'
import { error, warn } from '../../lib/logger'
import path from 'path'

interface CompilerResults {
  errors?: StatsError[]
  warnings?: StatsError[]
}

export class WebpackCompiler {
  private projectDir: string
  private config: EndlineConfig

  constructor({ projectDir, config }: any) {
    this.projectDir = projectDir
    this.config = config
  }

  async run() {
    const outputPath = path.join(this.projectDir, this.config.distDir)
    const webpackConfig: Configuration = {
      mode: 'production',
      context: this.projectDir,
      target: 'node12.17',
      entry: {
        './routes/index': './src/routes/index.js',
      },
      output: {
        path: outputPath,
      },
    }

    const { warnings, errors } = await this.build(webpackConfig)
    if (warnings?.length) {
      warn(warnings)
    }

    if (errors?.length) {
      error(errors)
    }
  }

  public build(config: webpack.Configuration): Promise<CompilerResults> {
    return new Promise((resolve, reject) => {
      const wpCompiler = webpack(config)

      wpCompiler.run((err?: Error | null, stats?: webpack.Stats) => {
        wpCompiler.close(() => {
          if (err) {
            reject(err)
          }

          const results = stats?.toJson('errors-warnings')
          resolve({
            warnings: results?.warnings,
            errors: results?.errors,
          })
        })
      })
    })
  }
}
