//Echo server
const net = require('net')

const server = net.createServer()

server.listen(5000, () => {
  console.log('I am listening')
})

server.on('connection', (client) => {
  console.log('A Client connected')
  client.on('data', (data) => {
    client.write('Hello, from the echo server!\n\n')
    client.write(data)
    client.end()
    client.on('end', () => {
      console.log('Socket connection ended')
    })
    client.on('error', (err) => {
      console.log(err)
    })
  })
})

server.on('error', (err) => {
  console.log(err)
})
