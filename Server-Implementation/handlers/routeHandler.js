const fs = require('fs')

const mimeTypes = {
  '.html' : 'text/html',
  '.css' : 'text/css',
  '.js' : 'application/javascript',
  '.json' : 'application/json',
  '.txt' : 'text/plain',
  '.jpg' : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.png' : 'image/png'
}

function routeHandler(request, routes, client) {
  console.log('Route Handler')
  const path = request.startLine.path
  let queryStrings
  if(request.startLine.queryStrings) queryStrings = request.startLine.queryStrings
  console.log(path)

  const getRoutes = routes.GET
  const postRoutes = routes.POST

  switch(request.startLine.method) {
    case 'GET' :  if(getRoutes.hasOwnProperty(path)) {
                    console.log(`GET at ${path}`)
                    getRoutes[path]()
                  }
                  else this.errorHandler(client)
                  break
    case 'POST' : if(getRoutes.hasOwnProperty(path)) {
                    console.log(`POST at ${path}`)
                    getRoutes[path]()
                  }
                  else this.errorHandler(client)
                  break
  }
}

module.exports = routeHandler
