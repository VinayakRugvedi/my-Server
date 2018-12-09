const server = require('./server')

//Creating the server
server.createServer(5000)
//Should pass a port number, if not passed it defaults to : 8080

//The static files are defaultly served from the 'public' directory
//You can change this directory to one of your own with :
server.staticServe('public')
//Replace 'public' with your directory

//You can add your endpoints with the 'addRoute' method of the server object
//Format : server.addRoute(/*http action verb*/, /*route*/, /*handler function*/)
server.addRoute('GET', '/echo', (req, res) => {
  console.log('I am echoing')
  res.send()
})
