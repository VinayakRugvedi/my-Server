const sendErrorStatusCode = require('../sendErrorStatusCode')

function validateRequest(request, client) {
  console.log('In validating request')
  if(!request.startLine.httpVersion.includes('HTTP/1.1')) {
    sendErrorStatusCode('505', client)
    return false
  }
  else if(request.startLine.method !== 'GET' && request.startLine.method !== 'POST') {
    sendErrorStatusCode('501', client)
    return false
  }
  else if(request.startLine.method === 'POST' && request.headers['content-length'] === undefined) {
    sendErrorStatusCode('400', client)
    return false
  }
  else if(request.headers['content-length'] !== undefined && (Number(request.headers['content-length']) !== request.body.length)) {
    sendErrorStatusCode('400', client)
    return false
  }
  else if(request.body.length > 0 && request.headers['content-length'] === undefined) {
    sendErrorStatusCode('411', client)
    return false
  }
  else if(request.headers['content-length'] !== undefined && (Number(request.headers['content-length']) !== request.body.length)) {
    sendErrorStatusCode('400', client)
    return false
  }
  else if(request.startLine.url.length > 100) {
    sendErrorStatusCode('411', client)
    return false
  }
  return true
}

module.exports = validateRequest
