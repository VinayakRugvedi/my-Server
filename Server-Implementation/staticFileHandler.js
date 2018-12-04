const fs = require('fs')

function servingStaticFiles(headers, client) {
  let responseHeader
  console.log(headers);
  console.log(headers['Accept'].slice(0, headers['Accept'].indexOf(',')))
  console.log(headers['start-line'].split(' '))
  switch(headers['Accept'].slice(0, headers['Accept'].indexOf(',')).trim()) {
    case 'text/html' :
    responseHeader =
                    `HTTP/1.1 200 OK
                    \r\n
                    `
                        client.write(responseHeader)
                        fs.readFile('./static-files/index.html', (err, content) => {
                          if(err) console.log(err)
                          client.write(content)
                          client.end()
                        })
                        break

    case 'text/css' :
    responseHeader =
                    `HTTP/1.1 200 OK
                    \r\n
                    `
                        client.write(responseHeader)
                        fs.readFile('./static-files'+headers['start-line'].split(' ')[1],
                        (err, content) => {
                          if(err) console.log(err)
                          client.write(content)
                          client.end()
                        })
                        break

    default :
    responseHeader =
                    `HTTP/1.1 200 OK
                    \r\n
                    `
                        client.write(responseHeader)
                        fs.readFile('./static-files'+headers['start-line'].split(' ')[1],
                        (err, content) => {
                          if(err) console.log(err)
                          client.write(content)
                          client.end()
                        })
                        break

    // default : console.log('Nothing Found')
  }
}

module.exports = servingStaticFiles
