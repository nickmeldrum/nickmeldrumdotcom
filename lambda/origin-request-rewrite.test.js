const { handler } = require('./origin-request-rewrite')
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
})
