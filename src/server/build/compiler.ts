import path from 'path'
import webpack, { Configuration, StatsError } from 'webpack'
import { EndlineConfig } from '../config'
import { error, warn } from '../../lib/logger'
import { getRouteFiles } from '../../lib/project-files-resolver'

interface CompilerResults {
  errors?: StatsError[]
  warnings?: StatsError[]
}

export class WebpackCompiler {
  private config: EndlineConfig
  private readonly projectDir: string
  private readonly routesDirectory: string

  constructor({ projectDir, config, routesDirectory }: any) {
    this.projectDir = projectDir
    this.config = config
    this.routesDirectory = routesDirectory
  }

  private createEntryPoints() {
    const entryPoints: Record<string, string> = {}
    const routeFiles = getRouteFiles(this.routesDirectory)

    for (const routeFile of routeFiles) {
      entryPoints[
        `routes/${path.parse(routeFile.fileName).name}`
      ] = `${routeFile.path}`
    }

    return entryPoints
  }

  private async buildConfiguration(outputPath: string): Promise<Configuration> {
    return {
      mode: 'development',
      name: 'server',
      context: this.projectDir,
      target: 'node12.17',
      entry: this.createEntryPoints(),
      devtool: false,
      output: {
        path: outputPath,
        libraryTarget: 'commonjs2',
      },
      optimization: {
        nodeEnv: false,
        minimize: false,
      },
      externals: [],
      externalsPresets: {
        node: true,
      },
      resolve: {
        extensions: ['.js', '.ts'],
        modules: ['node_modules'],
      },
      resolveLoader: {
        modules: ['node_modules'],
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        node: '12.17',
                      },
                    },
                  ],
                ],
              },
            },
          },
        ],
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
