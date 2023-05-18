/* eslint-disable */
import { Router } from 'endline/src/server/router'

describe('Router', function () {
  it('should map route handlers', () => {
    const router = new Router()

    router.GET('/route1', () => {})
    router.POST('/route2', () => {})

    // TODO: Get handler
    const handler = undefined // router.getHandler('GET', '/route1')
    expect(handler).not.toBe(undefined)
  })

  it('should map other routers', () => {
    const newRouter = new Router()
    newRouter.GET('/', () => {})

    const rootRouter = new Router()
    // TODO: Merge routers
    // rootRouter.merge(newRouter)

    // TODO: Get handler
    const handler = undefined // rootRouter.getHandler('GET', '/')
    expect(handler).not.toBe(undefined)
  })

  it('should map routers with relative url', () => {
    const newRouter = new Router('/test')
    newRouter.GET('/', () => {})

    const rootRouter = new Router()
    // TODO: Merge routers
    // rootRouter.merge(newRouter)

    // TODO: Get handler
    const handler = undefined // rootRouter.getHandler('GET', '/test')
    expect(handler).not.toBe(undefined)
  })

  it('should support multiple methods with the same url', () => {
    const router = new Router()
    router.GET('/', () => ({ method: 'GET' }))
    router.POST('/', () => ({ method: 'POST' }))

    // TODO: Get both handlers
    const GETHandler = undefined // router.getHandler('GET', '/')
    const POSTHandler = undefined // router.getHandler('POST', '/')

    expect(GETHandler).not.toBe(undefined)
    expect(POSTHandler).not.toBe(undefined)

    // TODO: Make sure they have their corresponding methods
    // expect(GETHandler?.().method).toBe('GET')
    // expect(POSTHandler?.().method).toBe('POST')
  })

  it('should map router with param url', () => {
    const testId = 'abc123'
    const router = new Router()

    router.GET('/:id', () => ({ testId }))

    // TODO: Get handler
    const handler = undefined // router.getHandler('GET', `/${testId}`)
    expect(handler).not.toBe(undefined)

    // TODO: Check if param id is present and is equal to testId
  })

  it('should not map two param routes with the same base', () => {
    const router = new Router()
    router.GET('/:id', () => ({ message: 'This is fine' }))
    router.GET('/:anotherId', () => {
      throw new Error('This is not')
    })

    // TODO: Get handler
    const handler = undefined // router.getHandler('GET', '/anotherId')
    expect(handler).not.toBe(undefined)
    expect(handler).not.toThrow(Error)
  })
})
