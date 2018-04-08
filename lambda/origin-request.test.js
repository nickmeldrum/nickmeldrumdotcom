const { handler } = require('./origin-request')
const testHandler = require('./test-lambda-edge-handler')

describe('origin request rewrite handler', () => {
  ;[
    { uri: 'something.js', expected: 'something.js' },
    { uri: 'something', expected: 'something.html' },
    { uri: 'over/the/rainbow.png', expected: 'over/the/rainbow.png' },
    { uri: 'over/the/rainbow', expected: 'over/the/rainbow.html' },
  ].forEach(testData => {
    it('adds .html when no file extension, adds nothing when extension present', () => {
      testHandler(handler)
        .withUri(testData.uri)
        .andAssert(request => expect(request.uri).toEqual(testData.expected))
    })
  })

  it('url is empty then add /index.html', () => {
    testHandler(handler)
      .withUri('')
      .andAssert(request => expect(request.uri).toEqual('/index.html'))
  })

  it('trailing slash redirects to no trailing slash', () => {
    testHandler(handler)
      .withUri('a/url/')
      .andAssert( request => {
          expect(request.status).toEqual('301')
          expect(request.headers.location[0].value).toEqual('a/url')
      })
  })
})
