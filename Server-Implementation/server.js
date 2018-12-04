const net = require('net')

const server = net.createServer()

server.listen(8080, () =>  {
  console.log('The server is listening at PORT 8080')
})

server.on('connection', (client) => {
  client.on('data', (data) => {
    //data in buffer
    const headers = parseHeaders(data)
    console.log(headers)
  })

  client.on('error', (err) => {
    console.log(err)
  })
})

server.on('error', (err) => {
  console.log(err)
})

function parseHeaders(data) {
  data = data.toString().split('\r\n')
  var headers = {}
  headers['start-line'] = data[0]
  data = data.slice(1)
  for(let item of data) {
    if(item.indexOf(':') !== -1 && item.length !== 0) {
      headers[item.slice(0, item.indexOf(':'))] = item.slice(item.indexOf(':') + 1)
    }
  }
  return headers
}
