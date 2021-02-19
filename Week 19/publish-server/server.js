let http = require('http')

http.createServer((request, response) => {
    console.log(request.headers)
    request.on('data', chunk => {
        console.log(chunk.toString())
    })

    request.on('end', chunk => {
        response.end('Success')
    })
}).listen(8082)