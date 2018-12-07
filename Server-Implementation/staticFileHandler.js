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

function servingStaticFiles(request, dir, client) {
  console.log('incoming');
  const path = request.startLine.path

  if(path === '/') {
    fs.readFile('./' + dir + '/index.html', (err, content) => {
      if(err) {
        console.log(err)
      } else {

let responseHeaders =
`HTTP/1.1 200 OK
Content-Type: text/html
Connection: keep-alive
Content-Length: ${content.toString().length - 1}
Date: ${new Date()}
Cache-Control: public, max-age=0
\r\n`
        // console.log(responseHeaders)
        let response = Buffer.concat([Buffer.from(responseHeaders), content])
        client.write(response)
        // client.end()
      }
    })
  } else {
    fs.readFile('./' + dir + path, (err, content) => {
      if(err) {
        console.log(err)
      } else {

        let responseHeaders =
`HTTP/1.1 200 OK
Content-Type: ${mimeTypes[path.slice(path.lastIndexOf('.'))]}
Connection: keep-alive
Content-Length: ${content.toString().length - 1}
Date: ${new Date()}
Cache-Control: public, max-age=0
\r\n` //CRLF

        let response = Buffer.concat([Buffer.from(responseHeaders), content])
        client.write(response)
        // client.end()
      }
    })
  }
}

module.exports = servingStaticFiles
