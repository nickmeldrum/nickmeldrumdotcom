const { handler } = require('./indexhtml-rewrite')

const testUri = uri => ({
  andAssert: assertion => {
    const mockCallback = jest.fn().mockImplementation((something, request) => {
      assertion(request)
    })

    const event = { Records: [{ cf: { request: { uri: uri } } }] }
    handler(event, {}, mockCallback)

    expect(mockCallback).toHaveBeenCalled()
  },
})

describe('rewrite handler', () => {
  [
    { uri: 'something/', expected: 'something' },
    { uri: 'something//', expected: 'something' },
    { uri: 'something///', expected: 'something' },
    {
      uri: 'http://www.something.com/somewhere/over/the/rainbow///',
      expected: 'http://www.something.com/somewhere/over/the/rainbow',
    },
  ]
    .forEach(testData => {
      it('redirects on a trailing slash', () => {
        testUri(testData.uri).andAssert(request =>
          expect(request.status).toEqual('301')
        )
      })

      it('redirects to a location without trailing slashes', () => {
        testUri(testData.uri).andAssert(request =>
          expect(request.headers.location[0].value).toEqual(testData.expected)
        )
      })
    })

    [{ uri: 'something' }].forEach(testData => {
      it('does not redirect', () => {
        testUri(testData.uri).andAssert(request =>
          expect(request.status).toEqual('200')
        )
      })
    })
})
