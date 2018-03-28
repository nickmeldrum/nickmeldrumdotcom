const { handler } = require('./indexhtml-rewrite')

describe('rewrite handler', () => {
  const callHandlerWith = options => {
    const event = { Records: [{ cf: { request: { uri: options.uri } } }] }
    handler(event, {}, options.callback)
  }

  const testUri = uri => ({
    andAssert: assertion => {
      let callbackCalled = false

      callHandlerWith({
        uri,
        callback: (something, request) => {
          assertion(request)
          callbackCalled = true
        },
      })

      expect(callbackCalled).toEqual(true)
    },
  })

  it('redirects on a trailing slash', () => {
    const assertion = request => expect(request.status).toEqual('301')
    testUri('something/').andAssert(assertion)
  })
})
