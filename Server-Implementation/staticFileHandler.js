const fs = require('fs')

function servingStaticFiles(headers, client) {
  const path = headers['start-line'].split(' ')[1]
  if(path === '/') {
    fs.readFile('./static-files/index.html', (err, content) => {
      if(err) console.log(err)

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
    })
  } else {
    fs.readFile('./static-files' + path, (err, content) => {
      if(err) console.log(err)

      let responseHeaders =
      `HTTP/1.1 200 OK
      Connection : keep-alive
      Content-Length : ${content.toString().length}
      \r\n
      `
      let response = Buffer.concat([Buffer.from(responseHeaders), content])
      client.write(response)
      client.end()
    })
  }
}

module.exports = servingStaticFiles
