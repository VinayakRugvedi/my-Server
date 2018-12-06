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
  // console.log(headers['start-line'].split(' ')[1])
  console.log(routes)
  const path = request.startLine.path
  let queryStrings
  if(request.startLine.queryStrings) queryStrings = request.startLine.queryStrings
  console.log(path)
  console.log(queryStrings)

  const getRoutes = routes.GET
  const postRoutes = routes.POST

  switch(request.startLine.method) {
    case 'GET' :  if(getRoutes.hasOwnProperty(path)) {
                    console.log(`GET at ${path}`)
                    getRoutes[path]()
                  }
                  break
    case 'POST' : if(getRoutes.hasOwnProperty(path)) {
                    console.log(`POST at ${path}`)
                    getRoutes[path]()
                  }
                  break
  }
}

module.exports = routeHandler
