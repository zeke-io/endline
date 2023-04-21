import path from 'path'
import webpack, { Configuration, StatsError } from 'webpack'
import { EndlineConfig } from '../config'
import { error, warn } from '../../lib/logger'

interface CompilerResults {
  errors?: StatsError[]
  warnings?: StatsError[]
}

export class WebpackCompiler {
  private readonly projectDir: string
  private readonly routeFiles: any[]
  private config: EndlineConfig

  constructor({ projectDir, config, routeFiles }: any) {
    this.projectDir = projectDir
    this.routeFiles = routeFiles
    this.config = config
  }

  private createEntryPoints() {
    const entryPoints: Record<string, string> = {}

    for (const routeFile of this.routeFiles) {
      entryPoints[
        `routes/${path.parse(routeFile.fileName).name}`
      ] = `./${routeFile.path}`
    }

    return entryPoints
  }

  private async buildConfiguration(outputPath: string): Promise<Configuration> {
    return {
      mode: 'production',
      context: this.projectDir,
      target: 'node12.17',
      entry: this.createEntryPoints(),
      output: {
        path: outputPath,
      },
      resolve: {
        modules: [path.join(this.projectDir, 'node_modules')],
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
    }
  }

  async run(outputPath: string) {
    const webpackConfig: Configuration = await this.buildConfiguration(
      outputPath,
    )

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
