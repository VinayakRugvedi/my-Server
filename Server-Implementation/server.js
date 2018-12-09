const net = require('net')

const parseRequest = require('./requestPipeline/parseRequest')
const staticFileHandler = require('./handlers/staticFileHandler')
const routeHandler = require('./handlers/routeHandler')
const sendErrorStatusCode = require('./sendErrorStatusCode')


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
      myServer.request = request
      if(request.startLine.method === 'GET')
        myServer.staticFileHandler(request, myServer.staticDir, client)
      else myServer.routeHandler(request, myServer.routes, client)
      return
      }
    })

    client.on('end', () => {
      console.log('SERVER : FIN packet recieved') //Will fire close event
    })

    client.on('close', () => {
      console.log('SERVER : The socket connection is closed')
    })

    client.setTimeout(3000)
    client.on('timeout', () => { //Fires after 3s of idleness
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

function staticServe(directory) {
  myServer.staticDir = directory
}

function addRoute(method, path, handlerFunction) {
  method = method.toUpperCase()
  myServer.routes[`${method}`][path] = handlerFunction
  console.log(myServer.routes)
}

function errorHandler(client) {
  sendErrorStatusCode('404', client)
}

const myServer = {
  createServer,
  staticDir : 'public',
  staticServe,
  addRoute,
  routes : {
    GET : {},
    POST : {}
  },
  staticFileHandler,
  routeHandler,
  errorHandler,
  userExposure : {
    createServer : createServer,
    staticServe : staticServe,
    addRoute : addRoute
  }
}

module.exports = myServer.userExposure
