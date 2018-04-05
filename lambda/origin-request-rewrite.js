const path = require('path')

const modifyRequestWithExtension = request => {
  const { uri } = request
  if (uri === '') {
    request.uri = '/index.html'
  }
  if (!path.extname(uri)) {
    request.uri = `${uri}.html`
  }
  return request
}

exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf

  callback(null, modifyRequestWithExtension(request))
}
