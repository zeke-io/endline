import { AppRouter, Router } from '../src/server/router'

describe('Router', function () {
  let appRouter: AppRouter

  beforeAll(() => {
    appRouter = new AppRouter()
  })

  it('should map GET handler', function () {
    const testRouter = new Router('test')
    testRouter.GET('/', async () => ({}))

    appRouter.addFromRouter(testRouter)
    const handler = appRouter.getHandler('/test', 'GET')
    expect(handler).not.toBe(undefined)
  })

  it('should map POST handler with same route as GET handler', function () {
    const testRouter = new Router('test')
    testRouter.POST('/', async () => ({}))

    appRouter.addFromRouter(testRouter)
    const handler = appRouter.getHandler('/test', 'POST')
    expect(handler).not.toBe(undefined)
  })

  it('should map route with param url', function () {
    const testRouter = new Router('test')
    const testId = 'testId'

    testRouter.GET('/:id', async () => ({}))
    appRouter.addFromRouter(testRouter)

    const handler = appRouter.getHandler(`/test/${testId}`, 'GET')
    expect(handler).not.toBe(undefined)
    expect(handler?.params?.id).toBe(testId)
  })
})
