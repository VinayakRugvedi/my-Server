const net = require('net')

const staticFileHandler = require('./staticFileHandler.js')
const routeHandler = require('./routeHandler')

function createServer(port = 8080) {
  const server = net.createServer()

  server.on('connection', (client) => {

    client.on('error', (err) => {
      console.log('SERVER : Socket Error! - The socket connection will be closed now')
      sendErrorStatusCode('500', client)
      // client.write('HTTP/1.1 500 Internal Server Error') //logs the above statement infinitely
      // client.destroy() //Will fire close event
    })

    client.on('data', (data) => {
      //Assuming complete request is available
      console.log(data.toString().split('\r\n'))
      var request = parseRequest(data, client)
      this.request = request
      console.log(request)
      // staticFileHandler(this.request, this.staticDir, client)
      routeHandler(this.request, this.routes, client)
    })

    client.on('end', () => {
      console.log('SERVER : FIN packet recieved') //Will fire close event
    })

    client.on('close', () => {
      console.log('SERVER : The socket connection is closed')
    })
  })

  server.listen(port, () =>  {
    console.log(`The server is listening at PORT ${port}`)
  })
  server.on('error', (err) => {
    console.log(err)
    sendErrorStatusCode('500', client)
  })
}


function parseRequest(data, client) {
  var request = {}
  let headerData = data.toString().slice(0, data.toString().indexOf('\r\n\r\n'))
  let bodyData = data.toString().slice(data.toString().indexOf('\r\n\r\n') + 4)

  var headers = {}

  headerData = headerData.split('\r\n')
  let startLine = headerData[0].split(' ')
  let firstLine = {}
  if(startLine.length > 3) {
    sendErrorStatusCode('400', client)
  }
  firstLine['method'] = startLine[0]
  firstLine['url'] = startLine[1]
  firstLine['http-version'] = startLine[2]

  parseUrl(firstLine)
  request.startLine = firstLine

  headerData = headerData.slice(1)
  for(let item of headerData) {
    if(item.includes(':')) {
      let headerKey = item.slice(0, item.indexOf(':')).toLowerCase()
      if(headerKey.includes(' ')) {
        sendErrorStatusCode('400', client)
      } else headers[headerKey] = item.slice(item.indexOf(':') + 2)
    }
  }

  request.headers = headers
  request.body = bodyData
  validateRequest(request, client) //Validating the request
  return request
}

function parseUrl(startLine) {
  console.log(startLine)
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

function validateRequest(request, client) {
  console.log(request.body.length);
  if(request.startLine.method !== 'GET' && request.startLine.method !== 'POST') {
    sendErrorStatusCode('501', client)
  }
  else if(request.startLine.method === 'POST' && request.headers['content-length'] === undefined) {
    sendErrorStatusCode('400', client)
  }
  else if(request.headers['content-length'] !== undefined && (Number(request.headers['content-length']) !== request.body.length)) {
    sendErrorStatusCode('400', client)
  }
  else if(request.body.length > 0 && request.headers['content-length'] === undefined) {
    sendErrorStatusCode('411', client)
  }
  else if(request.headers['content-length'] !== undefined && (Number(request.headers['content-length']) !== request.body.length)) {
    sendErrorStatusCode('400', client)
  }
  else if(request.startLine.url.length > 100) {
    sendErrorStatusCode('411', client)
  }
}

function sendErrorStatusCode(statusCode, client) {
  const httpStatusMessages = {
    '501' : 'Not Implemented',
    '500' : 'Internal Server Error',
    '505' : 'HTTP Version Not Supported',
    '400' : 'Bad Request',
    '404' : 'Not Found',
    '405' : 'Method Not Allowed',
    '411' : 'Length Required',
    '414' : 'URI Too Long'
  }
  let response =
`HTTP/1.1 ${statusCode} ${httpStatusMessages[statusCode]}
Connection: keep-alive
Content-Length: 0
Date: ${new Date()}
\r\n`
  client.write(Buffer.from(response))
  console.log('After writing')
}

function staticServe(directory) {
  this.staticDir = directory
}

function addRoute(method, path, handlerFunction) {
  method = method.toUpperCase()
  switch(method) {
    case 'GET' : this.routes.GET[path] = handlerFunction
                 break
    case 'POST' : this.routes.POST[path] = handlerFunction
                  break
  }
}

var myServer = {
  createServer : createServer,
  staticDir : 'public',
  staticServe : staticServe,
  addRoute : addRoute,
  routes : {
    GET : {},
    POST : {}
  }
}


myServer.createServer(5000)
// myServer.staticServe('customPublic')
myServer.addRoute('GET', '/', () => {
  console.log('i am god')
})
myServer.addRoute('POst', '/', info)

function info() {
  console.log('I am the information provider')
}
