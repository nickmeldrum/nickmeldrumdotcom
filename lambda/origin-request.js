const path = require('path')
const { STATUS_CODES } = require('http')

const redirect = uri => ({
  status: '301',
  statusDescription: STATUS_CODES['301'],
  headers: {
    location: [{ key: 'Location', value: uri }],
  },
})

const modifyRequestWithExtension = request => {
  const { uri } = request

  if (uri === '' || uri === '/') {
    request.uri = '/index.html'
    return request
  }

  if (!path.extname(uri)) {
    request.uri = `${uri}.html`
  }
  return request
}

const removeTrailingSlashes = uri => {
  if (uri === '' || uri === '/') return uri
  if (RegExp('.*?/+$').test(uri)) return uri.replace(/(\/+)$/gm, '')
  return uri
}

exports.handler = (event, context, callback) => {
  const { request, request: { uri } } = event.Records[0].cf

  let newUri = removeTrailingSlashes(uri)

  if (newUri !== uri) callback(null, redirect(newUri))
  else callback(null, modifyRequestWithExtension(request))
}
