let http = require('http')
let fs = require('fs')
let archiver = require('archiver')
let child_process = require('child_process')
let querystring = require('querystring')




child_process.exec(`start https://github.com/login/oauth/authorize?client_id=ca5e65490cad27c62dd7`)

http.createServer((request, response) => {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])
    publish(query.token, (body) => {
        response.end(body)
    })
}).listen(8083)


function publish(token, callback) {
    let request = http.request({
        method: "POST",
        hostname: '127.0.0.1',
        port: 8082,
        path: `/publish?token=${token}`,
        headers: {
            'content-type': 'application/octet-stream'
        }
    }, (response) => {
        let body = ''
        response.on('data', chunk => {
            body += chunk.toString()
        })
        response.on('end', chunk => {
            callback(body)
        })
    })
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    archive.directory('./sample/', false);

    archive.finalize();
    archive.pipe(request)

}


// let request = http.request({
//     hostname: '127.0.0.1',
//     port: 8082,
//     method: "POST",
//     headers: {
//         'content-type': 'application/octet-stream'
//     }
// }, res => {
//     console.log(res)
// })


// const archive = archiver('zip', {
//     zlib: { level: 9 } // Sets the compression level.
// });

// archive.directory('./sample/', false);

// archive.finalize();
// archive.pipe(request)





// let file = fs.createReadStream("./sample.html")
// file.pipe(request)
// file.on('end', () => { request.end() })




