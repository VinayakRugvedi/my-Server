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
  var response = {
    send : send
  }
  const path = request.startLine.path

  if(routes[`${request.startLine.method}`].hasOwnProperty(path)) {
    console.log(`${request.startLine.method} at ${path}`)
    routes[`${request.startLine.method}`][path](request, response)
  } else this.errorHandler(client)

  function send() {
    let body = JSON.stringify({Hello : 'World'})
    let responseHeaders =
`HTTP/1.1 200 OK
Content-Type: ${mimeTypes[path.slice(path.lastIndexOf('.'))]}
Connection: keep-alive
Content-Length: ${body.length}
Date: ${new Date().toUTCString()}
\r\n`
    client.write(Buffer.from(responseHeaders + body))
  }
}

module.exports = routeHandler
