const path = require('path')
const { src, dest, series, watch, parallel } = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const gulpSwc = require('gulp-swc')

/** @type {import('@swc/core').Options} */
const swcOptions = {
  jsc: {
    parser: {
      syntax: 'typescript',
      dynamicImport: true,
      importAssertions: true,
    },
    loose: true,
    target: 'es2016',
    externalHelpers: false,
  },
  module: {
    type: 'commonjs',
    ignoreDynamic: true,
  },
  env: {
    targets: {
      node: '14.17.3',
    },
  },
  sourceMaps: true,
  inlineSourcesContent: false,
}

async function clean() {
  const del = await import('del')
  return del.deleteSync(['dist/'])
}

async function buildPipeline(srcPath, distFolder, opts = {}) {
  return src([`src/${srcPath}`, `!src/${srcPath}.d.ts`])
    .pipe(sourcemaps.init())
    .pipe(gulpSwc(swcOptions))
    .pipe(
      sourcemaps.mapSources(function (sourcePath, _file) {
        const distPath = path.dirname(
          path.join(__dirname, 'dist', distFolder, sourcePath),
        )
        let filePath = path.join(__dirname, 'src', distFolder, sourcePath)
        // Replace .js extension to .ts
        filePath = path.format({ ...path.parse(filePath), base: '', ext: 'ts' })
        return path.relative(distPath, filePath)
      }),
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`dist/${distFolder}`, { ...opts }))
}

const bin = async () => buildPipeline('bin/**/*', 'bin', { mode: 0o755 })
const build = async () => buildPipeline('build/**/*', 'build')
const cli = async () => buildPipeline('cli/**/*', 'cli')
const config = async () => buildPipeline('config/**/*', 'config')
const lib = async () => buildPipeline('lib/**/*', 'lib')
const server = async () => buildPipeline('server/**/*', 'server')
const index = async () => buildPipeline('*.ts', '')

async function buildAll() {
  await bin()
  await build()
  await cli()
  await config()
  await lib()
  await server()
  await index()
}

exports.build = series(
  clean,
  parallel(bin, build, cli, config, lib, server, index),
)
exports.default = async function () {
  await clean()
  await buildAll()

  watch('src/bin/**/*', bin)
  watch('src/build/**/*', build)
  watch('src/cli/**/*', cli)
  watch('src/config/**/*', config)
  watch('src/lib/**/*', lib)
  watch('src/server/**/*', server)
  watch('src/*.ts', index)
}
