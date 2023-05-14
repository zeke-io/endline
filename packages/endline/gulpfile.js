const { src, dest, series, watch, parallel } = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const gulpSwc = require('gulp-swc')

/** @type {import('@swc/core').Options} */
const swcOptions = {
  jsc: {
    parser: {
      syntax: 'typescript',
      jsx: false,
      dynamicImport: true,
      importAssertions: true,
      topLevelAwait: true,
      preserveAllComments: false,
    },
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
}

const bin = async () => build('bin/**/*', 'bin', { mode: 0o755 })
const cli = async () => build('cli/**/*', 'cli')
const config = async () => build('config/**/*', 'config')
const lib = async () => build('lib/**/*', 'lib')
const server = async () => build('server/**/*', 'server')
const index = async () => build('*.ts', '')

async function clean() {
  const del = await import('del')
  return del.deleteSync(['dist/'])
}

async function build(path, distFolder, opts = {}) {
  return src(`src/${path}`)
    .pipe(sourcemaps.init())
    .pipe(gulpSwc(swcOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`dist/${distFolder}`, { ...opts }))
}

async function buildAll() {
  await bin()
  await cli()
  await config()
  await lib()
  await server()
  await index()
}

exports.build = series(clean, parallel(bin, cli, config, lib, server, index))
exports.default = async function () {
  await clean()
  await buildAll()

  watch('src/bin/**/*', bin)
  watch('src/cli/**/*', cli)
  watch('src/config/**/*', config)
  watch('src/lib/**/*', lib)
  watch('src/server/**/*', server)
  watch('src/*.ts', index)
}
