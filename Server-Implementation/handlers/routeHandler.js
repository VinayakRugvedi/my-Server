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

  if(routes[`${request.startLine.method}`].hasOwnProperty(path)) {
    console.log(`${request.startLine.method} at ${path}`)
    routes[`${request.startLine.method}`][path](request, {})
  } else this.errorHandler(client)
  return
}

module.exports = routeHandler
