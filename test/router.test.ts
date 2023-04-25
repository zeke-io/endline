/* eslint-disable */
import { Router } from '../src/server/router'

describe('Router', function () {
  it('should map other routers', () => {
    const rootRouter = new Router()
    const newRouter = new Router().GET('/', () => {})

    rootRouter.merge(newRouter)

    const handler = rootRouter.getHandler('GET', '/')
    expect(handler).not.toBe(undefined)
  })

  it('should map routers with relative url', () => {
    const rootRouter = new Router()
    const newRouter = new Router('/test').GET('/', () => {})

    rootRouter.merge(newRouter)

    const handler = rootRouter.getHandler('GET', '/test')
    expect(handler).not.toBe(undefined)
  })

  it('should support multiple methods with same url', () => {
    const router = new Router().GET('/', () => 'GET').POST('/', () => 'POST')

    const GETHandler = router.getHandler('GET', '/')
    const POSTHandler = router.getHandler('POST', '/')
    expect(GETHandler()).toBe('GET')
    expect(POSTHandler()).toBe('POST')
  })

  /*
  it('should map route with param url', function () {
    const testRouter = new Router('test')
    const testId = 'testId'
    testRouter.GET('/:id', async () => ({ method: 'GET', testId }))
    rootRouter.addFromRouter(testRouter)

    const handler = rootRouter.getHandler(`/test/${testId}`, 'GET')
    expect(handler).not.toBe(undefined)
    expect(handler?.params?.id).toBe(testId)
  })

  it('should not allow to register two param routes', async function () {
    const testRouter = new Router('test')
    testRouter.GET('/:another', async () => {
      throw new Error('This should not be called')
    })

    rootRouter.addFromRouter(testRouter)
    const handler = rootRouter.getHandler('/test/anotherId', 'GET')
    expect(handler?.handler).not.toThrow(Error)
    expect(handler?.params?.another).not.toBeDefined()
  })*/
})
