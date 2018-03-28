'use strict'

const path = require('path')
const { STATUS_CODES } = require('http')

exports.handler = (event, context, callback) => {
  const { request, request: { uri } } = event.Records[0].cf
  const redirect = to =>
    callback(null, {
      status: '301',
      statusDescription: STATUS_CODES['301'],
      headers: { location: [{ key: 'Location', value: to }] },
    })
  const removeTrailingSlashes = () => {
    if (RegExp('.*?/+$').test(uri)) {
      const newUri = uri.replace(/(\/+)$/gm, '')
      redirect(newUri ? newUri : '/')
      return true
    }
  }
  const setRequestWithExtensionInS3 = () => {
    if (!path.extname(uri)) {
      request.uri = path.join(uri, '.html')
    }
  }

  if (removeTrailingSlashes()) return
  setRequestWithExtensionInS3()

  callback(null, request)
}
