const net = require('net')

const staticFileHandler = require('./staticFileHandler')
const routeHandler = require('./routeHandler')
const sendErrorStatusCode = require('./sendErrorStatusCode')

const defaultHandlers = [staticFileHandler, routeHandler, errorHandler]

function createServer(port = 8080) {
  const server = net.createServer()

  server.on('connection', (client) => {

    client.setEncoding('utf-8')

    client.on('error', (err) => {
      console.log('SERVER : Socket Error! - The socket connection will be closed now')
      sendErrorStatusCode('500', client)
      client.destroy() //Will fire close event
    })

    client.on('data', (data) => {
      //Assuming complete request is available
      let request = parseRequest(data, client)
      if(!request)  return //The required msg would have already been given
      else {
      this.request = request
      staticFileHandler(request, this.staticDir, client, next)
      // if(!routeHandler(request, this.routes, client))
      }
    })

    client.on('end', () => {
      console.log('SERVER : FIN packet recieved') //Will fire close event
    })

    client.on('close', () => {
      console.log('SERVER : The socket connection is closed by client')
    })

    client.setTimeout(5000)
    client.on('timeout', () => {
      console.log('SERVER : The socket connection is being closed for being idle for too long')
      client.destroy()
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
  console.log(data.toString())
  console.log('In parsing request')
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

function errorHandler(client) {
  sendErrorStatusCode('404', client)
}

function next() {
  currentHandler = 0
  defaultHandlers[++currentHandler]()
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
myServer.addRoute('POst', '/', () => {
  console.log('I am the information provider')
})
