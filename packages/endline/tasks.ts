import { Pipeline } from 'endtask'

export const endtaskConfig = {
  plugins: ['./swc-plugin.ts'],
}

export default async function (pipeline: Pipeline) {
  await pipeline.remove('dist')
  await pipeline.run(build)

  // TODO
  /*await pipeline.watch('src/bin/!**!/!*', 'bin')
  await pipeline.watch('src/cli/!**!/!*', 'cli')
  await pipeline.watch('src/config/!**!/!*', 'config')
  await pipeline.watch('src/lib/!**!/!*', 'lib')
  await pipeline.watch('src/server/!**!/!*', 'server')
  await pipeline.watch('src/!*', 'index')*/
}

export async function build(pipeline: Pipeline) {
  await pipeline.parallel([bin, cli, config, lib, server, index])
}

export async function bin(pipeline: Pipeline) {
  await pipeline
    .source('src/bin/**/*')
    .swc()
    .destination('dist/bin', { mode: 0o755 })
}

export async function cli(pipeline: Pipeline) {
  await pipeline.source('src/cli/**/*').swc().destination('dist/cli')
}

export async function config(pipeline: Pipeline) {
  await pipeline.source('src/config/**/*').swc().destination('dist/config')
}

export async function lib(pipeline: Pipeline) {
  await pipeline.source('src/lib/**/*').swc().destination('dist/lib')
}

export async function server(pipeline: Pipeline) {
  await pipeline.source('src/server/**/*').swc().destination('dist/server')
}

export async function index(pipeline: Pipeline) {
  await pipeline.source('src/*').swc().destination('dist')
}
