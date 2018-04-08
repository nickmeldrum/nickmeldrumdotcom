const { handler } = require('./viewer-request')
const testHandler = require('./test-lambda-edge-handler')

describe('viewer request redirects handler', () => {
  it('empty uri does not redirect', () => {
    testHandler(handler)
      .withUri('')
      .andAssert(request => {
        expect(request.status).not.toEqual('301')
        expect(request.uri).toEqual('')
      })
  })
  ;[
    {
      input: { host: 'nickmeldrum.com', uri: 'something' },
      expected: { redirect: false },
    },
    {
      input: { host: 'nickmeldrum.com', uri: 'something/' },
      expected: { redirect: true, uri: 'something' },
    },
    {
      input: { host: 'nickmeldrum.com', uri: 'something//' },
      expected: { redirect: true, uri: 'something' },
    },
    {
      input: { host: 'nickmeldrum.com', uri: 'something///' },
      expected: { redirect: true, uri: 'something' },
    },
    {
      input: { host: 'nickmeldrum.com', uri: 'over/the/something///' },
      expected: { redirect: true, uri: 'over/the/something' },
    },
    {
      input: { host: 'nickmeldrum.com', uri: 'over/the/something' },
      expected: { redirect: false },
    },
    {
      input: { host: 'nickmeldrum.co.uk', uri: 'over/the/something' },
      expected: { redirect: true, uri: 'https://nickmeldrum.com/over/the/something' },
    },
    {
      input: { host: 'www.nickmeldrum.com', uri: 'over/the/something///' },
      expected: { redirect: true, uri: 'https://nickmeldrum.com/over/the/something' },
    },
    {
      input: { host: 'sdhfialshjflidsa.cloudfront.net', uri: 'over/the/something/' },
      expected: { redirect: true, uri: 'https://nickmeldrum.com/over/the/something' },
    },
  ].forEach(testData => {
    if (testData.expected.redirect) {
      it(`uri "${testData.input.uri}" and host "${testData.input.host}" redirects`, () => {
        testHandler(handler)
          .withUri(testData.input.uri)
          .andHost(testData.input.host)
          .andAssert(request => expect(request.status).toEqual('301'))
      })

      it('sets the description when redirecting', () => {
        testHandler(handler)
          .withUri(testData.input.uri)
          .andHost(testData.input.host)
          .andAssert(request => expect(request.statusDescription).toEqual('Moved Permanently'))
      })

      it(`uri "${testData.input.uri}" and host "${testData.input.host}" redirects to "${
        testData.expected.uri
      }" and host "nickmeldrum.com"`, () => {
        testHandler(handler)
          .withUri(testData.input.uri)
          .andHost(testData.input.host)
          .andAssert(request => {
            expect(request.headers.location[0].value).toEqual(testData.expected.uri)
          })
      })
    }

    if (!testData.expected.redirect) {
      it(`uri "${testData.input.uri}" and host "${testData.input.host}" does not redirect`, () => {
        testHandler(handler)
          .withUri(testData.input.uri)
          .andHost(testData.input.host)
          .andAssert(request => expect(request.status).not.toEqual('301'))
      })

      it(`uri "${testData.input.uri}" and host "${testData.input.host}" returns uri "${
        testData.expected.uri
      }"`, () => {
        testHandler(handler)
          .withUri(testData.input.uri)
          .andHost(testData.input.host)
          .andAssert(request => expect(request.uri).toEqual(testData.input.uri))
      })
    }
  })
})
