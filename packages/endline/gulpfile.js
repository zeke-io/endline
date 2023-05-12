const { src, dest, series, watch } = require('gulp')
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

async function clean() {
  const del = await import('del')
  return del.deleteSync(['dist/'])
}

async function build() {
  return src('src/**/*')
    .pipe(sourcemaps.init())
    .pipe(gulpSwc(swcOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/'))
}

exports.build = series(clean, build)
exports.default = async function () {
  await clean()
  await build()

  watch('src/**/*', build)
}
