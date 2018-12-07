const httpStatusMessages = {
  '501' : 'Not Implemented',
  '500' : 'Internal Server Error',
  '505' : 'HTTP Version Not Supported',
  '400' : 'Bad Request',
  '404' : 'Not Found',
  '405' : 'Method Not Allowed',
  '411' : 'Length Required',
  '414' : 'URI Too Long'
}

function sendErrorStatusCode(statusCode, client) {
  let response =
`HTTP/1.1 ${statusCode} ${httpStatusMessages[statusCode]}
Connection: keep-alive
Content-Length: 0
Date: ${new Date()}
\r\n`
  client.write(Buffer.from(response))
  console.log('After sending error status code')
}

module.exports = sendErrorStatusCode
