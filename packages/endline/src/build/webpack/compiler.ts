import path from 'path'
import webpack, { Configuration, StatsError } from 'webpack'
import { error, warn } from '../../lib/logger'
import { getMainFile, getRouteFiles } from '../../lib/project-files-resolver'

interface CompilerResults {
  errors?: StatsError[]
  warnings?: StatsError[]
}

export class WebpackCompiler {
  private readonly projectDir: string
  private readonly routesDirectory: string
  private readonly shouldClean: boolean

  constructor({
    projectDir,
    routesDirectory,
    clean,
  }: {
    projectDir: string
    routesDirectory: string
    clean?: boolean
  }) {
    this.projectDir = projectDir
    this.routesDirectory = routesDirectory
    this.shouldClean = clean || false
  }

  private createEntryPoints() {
    const entries: webpack.EntryObject = {}
    const routeFiles = getRouteFiles(this.routesDirectory)

    for (const routeFile of routeFiles) {
      entries[
        `routes/${path.parse(routeFile.fileName).name}`
      ] = `${routeFile.path}`
    }

    const mainFilePath = getMainFile(this.projectDir, true)
    if (mainFilePath) {
      entries['index'] = mainFilePath
    }

    return entries
  }

  private externalsHandler(
    _context?: string,
    _request?: string,
    _dependencyType?: string,
    _getResolve?: () => unknown,
    callback?: () => void,
  ) {
    // TODO: Implement this
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
        clean: this.shouldClean,
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
            test: /\.m?js$/,
            include: [this.projectDir],
            exclude: /node_modules/,
            use: {
              loader: require.resolve('babel-loader'),
              options: {
                targets: {
                  node: '12.17',
                },
                cwd: this.projectDir,
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
      for (const statError of errors) {
        console.error(statError)
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
