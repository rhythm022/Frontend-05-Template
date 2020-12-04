const http = require('http')
// 创建web应用服务器，用http很简单，帮助我们接受请求、生成http响应报文
http.createServer((request,response)=>{
  let body = []

  request
  .on('error',error=>{
    console.error(error)
  })
  .on('data',chunk=>{
    body.push(chunk.toString())//toString()为什么？？chunk原来是什么类型？？
  })
  .on('end',()=>{
    body = body.join('')
    console.log('body:',body)

    response.writeHead(200,{'Content-Type':'text/html'})
    response.end(' hello'.repeat(500))
  })
}).listen(8088)

console.log('server started');











// let buf1 = new Buffer('宝宝');
// let buf2 = new BUffer('baobao');
// let buf3 = Buffer.concat([buf1,buf2]);
// console.log(buf3.toSting());//宝宝baobao
