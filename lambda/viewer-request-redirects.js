const { STATUS_CODES } = require('http')

const canonicalHost = 'nickmeldrum.com'

const modifyRequestToARedirect = (request, uri) => {
  request.status = '301'
  request.statusDescription = STATUS_CODES['301']
  request.headers.location = [{ key: 'Location', value: uri }]
  request.headers.host = [{ key: 'Host', value: canonicalHost }]
  return request
}

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

  if (newUri !== uri) callback(null, modifyRequestToARedirect(request, newUri))
  else callback(null, request)
}
