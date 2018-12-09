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

function servingStaticFiles(request, dir, client, next) {
  console.log('Static file handler')
  let path = request.startLine.path
  if(path === '/') path = '/index.html'
  fs.readFile('./' + dir + path, (err, content) => {
    if(err) {
      console.log(err)
      this.routeHandler(request, this.routes, client)
    } else {
      let responseHeaders =
`HTTP/1.1 200 OK
Content-Type: ${mimeTypes[path.slice(path.lastIndexOf('.'))]}
Connection: keep-alive
Content-Length: ${content.toString().length - 1}
Date: ${new Date()}
Cache-Control: public, max-age=31536000
\r\n` //CRLF

      let response = Buffer.concat([Buffer.from(responseHeaders), content])
      client.write(response)
    }
  })
  return
}

module.exports = servingStaticFiles
