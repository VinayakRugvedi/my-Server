const validateRequest = require('./validateRequest')
const sendErrorStatusCode = require('../sendErrorStatusCode')

function parseRequest(data, client) {
  console.log('In parsing request')
  var request = {}
  let headerData = data.toString().slice(0, data.toString().indexOf('\r\n\r\n'))
  let bodyData = data.toString().slice(data.toString().indexOf('\r\n\r\n') + 4)

  var headers = {}

  headerData = headerData.split('\r\n')
  let startLine = headerData[0].split(' ')
  let firstLine = {}
  if(startLine.length !== 3) {
    sendErrorStatusCode('400', client)
  }
  firstLine['method'] = startLine[0]
  firstLine['url'] = startLine[1]
  firstLine['httpVersion'] = startLine[2]

  parseUrl(firstLine)
  request.startLine = firstLine

  headerData = headerData.slice(1)
  for(let item of headerData) {
    if(item.includes(':')) {
      let headerKey = item.slice(0, item.indexOf(':')).toLowerCase()
      if(headerKey.includes(' ')) {
        sendErrorStatusCode('400', client) //Header key shouldnt have a space
      } else headers[headerKey] = item.slice(item.indexOf(':') + 2)
    }
  }

  request.headers = headers
  request.body = bodyData
  if(validateRequest(request, client)) //Validating the request
    return request
  return false
}

function parseUrl(startLine) {
  console.log('In parse URL')
  if(!startLine.url.includes('?')) {
    startLine.path = startLine.url
  } else {
    let path = startLine.url.slice(0, startLine.url.indexOf('?'))
    let queryStrings = startLine.url.slice(startLine.url.indexOf('?') + 1).split('&')
    let params = {}
    for(let query of queryStrings) {
      params[query.slice(0, query.indexOf('='))] = query.slice(query.indexOf('=') + 1)
    }
    startLine.path = path
    startLine.queryStrings = params
  }
}

module.exports = parseRequest
