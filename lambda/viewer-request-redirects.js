const { STATUS_CODES } = require('http')

const canonicalHost = 'nickmeldrum.com'

const redirect = uri => ({
  status: '301',
  statusDescription: STATUS_CODES['301'],
  headers: {
    location: [{ key: 'Location', value: uri }]
  }
})

const removeTrailingSlashes = uri => {
  if (uri === '/') return ''
  if (RegExp('.*?/+$').test(uri)) return uri.replace(/(\/+)$/gm, '')
  return uri
}

const setCanonicalHost = (host, uri) => {
  if (host !== canonicalHost) return `https://${canonicalHost}/${uri}`
  return uri
}

exports.handler = (event, context, callback) => {
  const { request, request: { uri } } = event.Records[0].cf
  const host = request.headers.host[0].value

  let newUri = removeTrailingSlashes(uri)
  newUri = setCanonicalHost(host, newUri)

  if (newUri !== uri) callback(null, redirect(newUri))
  else callback(null, request)
}
