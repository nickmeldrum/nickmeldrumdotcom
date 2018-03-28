const { handler } = require('./indexhtml-rewrite')

const testUri = uri => ({
  andAssert: assertion => {
    let callbackCalled = false

    const event = { Records: [{ cf: { request: { uri: uri } } }] }
    handler(event, {}, (something, request) => {
      assertion(request)
      callbackCalled = true
    })

    expect(callbackCalled).toEqual(true)
  },
})

describe('rewrite handler', () => {
  it('redirects on a trailing slash', () => {
    testUri('something/').andAssert(request =>
      expect(request.status).toEqual('301')
    )
  })
})
