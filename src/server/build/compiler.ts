import path from 'path'
import webpack, { Configuration, StatsError } from 'webpack'
import { error, warn } from '../../lib/logger'
import { getRouteFiles } from '../../lib/project-files-resolver'

interface CompilerResults {
  errors?: StatsError[]
  warnings?: StatsError[]
}

export class WebpackCompiler {
  private readonly projectDir: string
  private readonly routesDirectory: string

  constructor({ projectDir, routesDirectory }: any) {
    this.projectDir = projectDir
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

  private externalsHandler(
    context?: string,
    request?: string,
    dependencyType?: string,
    getResolve?: () => unknown,
    callback?: () => void,
  ) {
    // const isEsm = dependencyType === 'esm'
    callback?.()
  }

  private async buildConfiguration(outputPath: string): Promise<Configuration> {
    return {
      mode: 'none',
      name: 'server',
      context: this.projectDir,
      devtool: false,
      target: 'node12.17',
      entry: this.createEntryPoints(),
      output: {
        path: outputPath,
        libraryTarget: 'commonjs2',
      },
      experiments: {
        cacheUnaffected: true,
      },
      optimization: {
        nodeEnv: false,
        minimize: false,
      },
      externals: [
        ({ context, request, dependencyType, getResolve }, callback) =>
          this.externalsHandler(
            context,
            request,
            dependencyType,
            getResolve,
            callback,
          ),
      ],
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
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
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

  async run(outputPath?: string) {
    outputPath ??= path.join(this.projectDir, 'dist/')

    const webpackConfig: Configuration = await this.buildConfiguration(
      outputPath,
    )

    const { warnings, errors } = await this.build(webpackConfig)

    if (errors?.length) {
      error('Failed to compile application, please fix the following errors:')
      for (const error of errors) {
        console.error(error)
      }
      process.exit(1)
    }

    if (warnings?.length) {
      warn('Application compiled with some warnings:')
      for (const warning of warnings) {
        console.warn(warning)
      }
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
