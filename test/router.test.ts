/* eslint-disable */
import { Router } from 'endline/src/server/router'

describe('Router', function () {
  it('should map GET handler', () => {
    const router = new Router().GET('/', () => {})

    const handler = router.getHandler('GET', '/')
    expect(handler).not.toBe(undefined)
  })

  it('should map other routers', () => {
    const newRouter = new Router().GET('/', () => {})

    const rootRouter = new Router()
    rootRouter.merge(newRouter)

    const handler = rootRouter.getHandler('GET', '/')
    expect(handler).not.toBe(undefined)
  })

  it('should map routers with relative url', () => {
    const newRouter = new Router('/test').GET('/', () => {})

    const rootRouter = new Router()
    rootRouter.merge(newRouter)

    const handler = rootRouter.getHandler('GET', '/test')
    expect(handler).not.toBe(undefined)
  })

  it('should support multiple methods with the same url', () => {
    const router = new Router()
      .GET('/', () => ({ method: 'GET' }))
      .POST('/', () => ({ method: 'POST' }))

    const GETHandler = router.getHandler('GET', '/')
    const POSTHandler = router.getHandler('POST', '/')

    expect(GETHandler).not.toBe(undefined)
    expect(POSTHandler).not.toBe(undefined)

    expect(GETHandler?.().method).toBe('GET')
    expect(POSTHandler?.().method).toBe('POST')
  })

  it('should map router with param url', () => {
    const testId = 'abc123'
    const router = new Router().GET('/:id', () => ({ testId }))

    const handler = router.getHandler('GET', `/${testId}`)
    expect(handler).not.toBe(undefined)
    // TODO: Check if param id is present and is equal to testId
  })

  it('should not map two param routes with the same base', () => {
    const router = new Router()
      .GET('/:id', () => ({ message: 'This is fine' }))
      .GET('/:anotherId', () => {
        throw new Error('This is not')
      })

    const handler = router.getHandler('GET', '/anotherId')
    expect(handler).not.toThrow(Error)
  })
})
