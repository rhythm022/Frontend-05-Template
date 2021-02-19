let http = require('http')
let fs = require('fs')

http.createServer((request, response) => {
    console.log(request.headers)

    const outFile = fs.createWriteStream('../server/public/index.html')
    request.on('data', chunk => {
        outFile.write(chunk.toString())
    })

    request.on('end', () => {
        outFile.end()
        response.end('Success')
    })
}).listen(8082)