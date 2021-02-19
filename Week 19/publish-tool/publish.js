let http = require('http')
let fs = require('fs')





let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: "POST",
    headers: {
        'content-type': 'application/octet-stream'
    }
}, res => {
    console.log(res)
})







//"./favicon.ico"
let file = fs.createReadStream("./package.json")

file.on('data', chunk => {
    request.write(chunk)
})

file.on('end', chunk => {
    request.end()

})