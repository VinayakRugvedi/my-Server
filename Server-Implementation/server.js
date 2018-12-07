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
      this.request = request
      this.staticFileHandler(request, this.staticDir, client)
      }
    })

    client.on('end', () => {
      console.log('SERVER : FIN packet recieved') //Will fire close event
    })

    client.on('close', () => {
      console.log('SERVER : The socket connection is closed')
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
  errorHandler
}


myServer.createServer(5000)

myServer.addRoute('GET', '/echo', () => {
  console.log('i am god')
})
myServer.addRoute('POst', '/', () => {
  console.log('I am the information provider')
})
