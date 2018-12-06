const net = require('net')

const servingStaticFiles = require('./staticFileHandler.js')
const routeHandler = require('./routeHandler')

function createServer(port = 8080) {
  const server = net.createServer()

  server.on('connection', (client) => {

    client.on('error', (err) => {
      console.log('SERVER : Socket Error! - The socket connection is closed now')
      client.write('HTTP/1.1 500 Internal Server Error')
      client.end()
    })

    client.on('data', (data) => {
      //Assuming complete request is available
      var request = parseRequest(data, client)
      console.log(request)
    })

    client.on('end', () => {
      console.log('SERVER : FIN packet recieved')
    })

    client.on('close', () => {
      console.log('SERVER : The client has disconnected the socket connection')
    })
  })

  server.listen(port, () =>  {
    console.log(`The server is listening at PORT ${port}`)
  })
  server.on('error', (err) => {
    console.log(err)
    client.write('HTTP/1.1 500 Internal Server Error')
    client.end()
  })
}


function parseRequest(data, client) {
  var request = {}
  let [headerData, bodyData] = data.toString().split('\r\n\r\n')
  var headers = {}

  headerData = headerData.split('\r\n')
  let startLine = headerData[0].split(' ')
  if(startLine.length > 3) {
    client.write('HTTP/1.1 400 Bad Request')
    client.end()
  }
  headers['method'] = startLine[0]
  headers['url'] = startLine[1]
  headers['http-version'] = startLine[2]

  parseUrl(headers)
  headerData = headerData.slice(1)
  for(let item of headerData) {
    if(item.includes(':')) {
      let headerKey = item.slice(0, item.indexOf(':'))
      if(headerKey.includes(' ')) {
        client.write('HTTP/1.1 400 Bad Request')
        client.end()
      } else headers[item.slice(0, item.indexOf(':'))] = item.slice(item.indexOf(':') + 2)
    }
  }

  request.headers = headers

  validateHeaders(headers, client) //Validating the header

  request.body = bodyData
  return request
}

function parseUrl(headers) {
  if(!headers.url.includes('&')) {
    headers.path = headers.url
  } else {
    let path = headers.url.slice(0, headers.url.indexOf('?'))
    let queryStrings = headers.url.slice(headers.url.indexOf('?') + 1).split('&')
    let params = {}
    for(let query of queryStrings) {
      params[query.slice(0, query.indexOf('='))] = query.slice(query.indexOf('=') + 1)
    }
    headers.path = path
    headers.queryStrings = params
  }
}

function validateHeaders(headers, client) {
  if(headers.method !== 'GET' && headers.method !== 'POST') {
    client.write('HTTP/1.1 501 Not Implemented')
    client.end()
  }
  if(headers.method === 'POST' && headers['Content-Length'] === undefined) {
    client.write('HTTP/1.1 400 Bad Request')
    client.end()
  }
}


createServer(5000)
