const { handler } = require('./index')
const testHandler = require('test-lambda-edge-handler')

describe('viewer request redirects handler', () => {
  it('host nickmeldrum.co.uk and url a/b redirects to https://nickmeldrum.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('nickmeldrum.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host nickmeldrum.co.uk and url /a/b redirects to https://nickmeldrum.com/a/b', () => {
    testHandler(handler)
      .withUri('/a/b')
      .andHost('nickmeldrum.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host nickmeldrum.co.uk and url / redirects to https://nickmeldrum.com', () => {
    testHandler(handler)
      .withUri('/')
      .andHost('nickmeldrum.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com')
        expect(request.status).toEqual('301')
      })
  })

  it('host nickmeldrum.co.uk and url "" redirects to https://nickmeldrum.com', () => {
    testHandler(handler)
      .withUri('')
      .andHost('nickmeldrum.co.uk')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com')
        expect(request.status).toEqual('301')
      })
  })

  it('host a23dj9ffdja.cloudfront.net and url a/b redirects to https://nickmeldrum.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('a23dj9ffdja.cloudfront.net')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host www.nickmeldrum.com and url a/b redirects to https://nickmeldrum.com/a/b', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('www.nickmeldrum.com')
      .andAssert(request => {
        expect(request.headers.location[0].value).toEqual('https://nickmeldrum.com/a/b')
        expect(request.status).toEqual('301')
      })
  })

  it('host nickmeldrum.com and url a/b does not redirect', () => {
    testHandler(handler)
      .withUri('a/b')
      .andHost('nickmeldrum.com')
      .andAssert(request => {
        expect(request.uri).toEqual('a/b')
        expect(request.status).not.toEqual('301')
      })
  })
})
