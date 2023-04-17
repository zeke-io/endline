import { AppRouter, Router } from '../src/server/router'

describe('Router', function () {
  let appRouter: AppRouter

  beforeAll(() => {
    appRouter = new AppRouter()
  })

  it('should map GET handler', function () {
    const router = new Router('test')
    router.GET('/', async () => ({ method: 'GET' }))
    appRouter.addFromRouter(router)

    const handler = appRouter.getHandler('/test', 'GET')

    expect(handler).not.toBe(undefined)
  })

  it('should map POST handler with same route as GET handler', function () {
    const testRouter = new Router('test')
    testRouter.POST('/', async () => ({ method: 'POST' }))
    appRouter.addFromRouter(testRouter)

    const handler = appRouter.getHandler('/test', 'POST')
    expect(handler).not.toBe(undefined)
  })

  it('should map route with param url', function () {
    const testRouter = new Router('test')
    const testId = 'testId'
    testRouter.GET('/:id', async () => ({ method: 'GET', testId }))
    appRouter.addFromRouter(testRouter)

    const handler = appRouter.getHandler(`/test/${testId}`, 'GET')
    expect(handler).not.toBe(undefined)
    expect(handler?.params?.id).toBe(testId)
  })

  it('should not allow to register two param routes', async function () {
    const testRouter = new Router('test')
    testRouter.GET('/:another', async () => {
      throw new Error('This should not be called')
    })

    appRouter.addFromRouter(testRouter)
    const handler = appRouter.getHandler('/test/anotherId', 'GET')
    expect(handler?.handler).not.toThrow(Error)
    expect(handler?.params?.another).not.toBeDefined()
  })
})
