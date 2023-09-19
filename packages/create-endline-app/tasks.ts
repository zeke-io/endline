import { Pipeline } from 'endtask'

export const endtaskConfig = {
  plugins: ['../endline/swc-plugin.ts'],
}

export default async function (pipeline: Pipeline) {
  await pipeline.remove('dist')
  await pipeline.run(build)

  // TODO
  /*await pipeline.watch('src/!**!/!*', 'build')*/
}

export async function build(pipeline: Pipeline) {
  await pipeline.source('src/**/*').swc().destination('dist')
}
