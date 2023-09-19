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

export const plugin = {
  name: 'swc',
}

export default async function SwcPlugin() {
  console.log('SWC')
}
