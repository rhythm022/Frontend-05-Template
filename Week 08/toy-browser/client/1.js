const net = require('net')

class Request{
  constructor(options) {
    //
    this.host = options.host
    this.port = options.port || 80

    this.method = options.method
    this.path = options.path
    this.headers = options.headers || {}
    this.body = options.body || {}
    if(!this.headers['Content-Type'])
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    // 根据Content-Type生成bodyText
    if(this.headers['Content-Type'] === 'application/json')
      this.bodyText = JSON.stringify(this.body)
    else if(this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
      this.bodyText = Object.keys(this.body).map(key=>`${key}=${encodeURIComponent(this.body[key])}`).join('&')


    this.headers['Content-Length'] = this.bodyText.length
  }

  // ★★★ 发送请求的人也要等待响应
  send(connection){
    return new Promise((resolve,reject) => {
      const parser = new ResponseParser

      // 发送请求很简单就是借助tcp的接口，有内容响回tcp就把信息交给我们
      if(connection){
        connection.write(this.toString())
      }else{
        connection = net.createConnection({
          host:this.host,
          port:this.port,
        },()=>{
          connection.write(this.toString())
        })
      }

      //
      connection.on('data',data=>{
        console.log(data.toString())
        parser.receive(data.toString())

        //
        if(parser.isFinished){
          resolve(parser.response)
          connection.end()//断开连接/实现短连接
        }
      })
      connection.on('error',err=>{
        reject(err)
        connection.end()//断开连接

      })
    })
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
    ${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}\r
    \r
    ${this.bodyText}`
  }
}


class ResponseParser{
  receive(str){
    for (const ch of str) {
      this.receiveChar(ch)
    }
  }
  receiveChar(ch){}
}
void async function (){
  let request = new Request({
    host:'127.0.0.1',
    port:'8088',
    method:'POST',
    path:'/',
    headers:{
      ['X-Foo2']:'customed'
    },
    body:{
      name:'dylan'
    }
  })

  let response = await request.send()

  console.log(response)
}()
