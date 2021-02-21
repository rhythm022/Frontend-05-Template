let http = require('http')
let https = require('https')
let fs = require('fs')
let unzipper = require('unzipper')
let querystring = require('querystring')

// 前
// tool调用github.auth()
// github.auth()回调server.auth(code)：server.auth(code)内部调用github.access_token(code)...
// 让server.auth(code)返回供用户调用tool.publish(token)的界面：最主要是把token传给tool使得tool可以做一切想做的，不局限于publish

// 后
// tool.publish(token)内部调用server.publish(token,file)
// server.publish(token,file)内部调用github.user()确认身份后完成了规定动作：发布文件
// 调用/请求
function auth(request, response) {
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1])
    getToken(query.code, (info) => {
        response.write(`<a href='http://localhost:8083/publish?token=${info.access_token}'>publish</a>`)
        response.end()
    })
}
function getToken(code, callback) {
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=ca5e65490cad27c62dd7&client_secret=5afbb7ee679bfbb34fdabd52a119b6e26683d6f3`,
        port: 443,
        method: "POST"
    }, function (response) {
        let body = ''
        response.on('data', chunk => {
            body += chunk.toString()
        })
        response.on('end', chunk => {
            let o = querystring.parse(body)

            callback(o)
        })
    })

    request.end()
}


function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])
    getUser(query.token, (info) => {
        if (info.login === 'rhythm022') {
            request.pipe(unzipper.Extract({ path: '../server/public' }));

            request.on('end', () => {
                response.end('Success')
            })
        }
    })
}
function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        port: 443,
        method: "GET",
        headers: {
            'Authorization': `token ${token}`,
            'user-agent': 'toy-publish'
        }
    }, function (response) {
        let body = ''
        response.on('data', chunk => {
            body += chunk.toString()
        })
        response.on('end', chunk => {
            callback(JSON.parse(body))
        })
    })

    request.end()
}


http.createServer((request, response) => {
    console.log(request.url)
    if (request.url.match(/^\/auth\?/)) return auth(request, response)
    if (request.url.match(/^\/publish/)) return publish(request, response)

    // console.log(request.headers)

    // request.pipe(unzipper.Extract({ path: '../server/public' }));

    // request.on('end', () => {
    //     response.end('Success')
    // })
}).listen(8082)