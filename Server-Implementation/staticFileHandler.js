const fs = require('fs')

const mimeType = {
  '.html' : 'text/html',
  '.css' : 'text/css',
  '.js' : 'text/javascript',
  '.json' : 'application.json',
  '.jpg' : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.png' : 'image/png'
}

function servingStaticFiles(headers, client) {
  const path = headers['start-line'].split(' ')[1]
  if(path === '/') {
    fs.readFile('./static-files/index.html', (err, content) => {
      if(err) {
        console.log(err)
        if(err.errno === -2) {
          client.write(`HTTP/1.1 404 Not Found
                        Content-Type : text/html
                        \r\n
                        <html><body>Not Found!</body></html>`)
          client.end()
        }
      } else {

        let responseHeaders =
        `HTTP/1.1 200 OK
        Content-Type : text/html
        Connection : keep-alive
        Content-Length : ${content.toString().length}
        \r\n
        `
        let response = Buffer.concat([Buffer.from(responseHeaders), content])
        client.write(response)
        client.end()
      }
    })
  } else {
    fs.readFile('./static-files' + path, (err, content) => {
      if(err) {
        console.log(err)
        if(err.errno === -2) {
          client.write(`HTTP/1.1 404 Not Found
                        Content-Type : text/html
                        \r\n
                        <html><body>Not Found!</body></html>`)
          client.end()
        }
      } else {

        let responseHeaders =
        `HTTP/1.1 200 OK
        Content-Type : ${mimeType[path.slice(path.lastIndexOf('.'))]}
        Connection : keep-alive
        Content-Length : ${content.toString().length}
        \r\n
        `
        let response = Buffer.concat([Buffer.from(responseHeaders), content])
        client.write(response)
        client.end()
      }
    })
  }
}

module.exports = servingStaticFiles
