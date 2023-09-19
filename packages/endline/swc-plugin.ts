import { Plugin, PluginPipe } from 'endtask'
import { Options } from '@swc/core'

const swcOptions: Options = {
  jsc: {
    parser: {
      syntax: 'typescript',
      dynamicImport: true,
      // @ts-ignore
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

const plugin: Plugin = {
  name: 'swc',
  type: 'source',
  entry: swcPlugin,
}

async function swcPlugin({ config: _config }: PluginPipe) {
  console.log('SWC')
}

export default plugin
