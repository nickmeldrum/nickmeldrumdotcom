exports.handler = (event, context, callback) => {
  const { request, request: { uri } } = event.Records[0].cf
  const host = request.headers.host[0].value

  console.log('NICK WAS HERE TESTING HIS VIEWER REQUEST LATENCIES', host, uri)
  callback(null, request)
}
