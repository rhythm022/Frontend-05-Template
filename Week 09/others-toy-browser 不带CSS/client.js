const net = require('net');
const util = require('util');
const parser = require('./parser');

// 解析响应数据体
class ChunkedParser {
  constructor() {
    this.WAITING_LENGTH = 'WAITING_LENGTH';
    this.WAITING_LENGTH_END = 'WAITING_LENGTH_END';
    this.READING_CHUNK = 'READING_CHUNK';
    this.WAITING_NEW_LENGTH = 'WAITING_NEW_LENGTH';
    this.WAITING_NEW_LENGTH_END = 'WAITING_NEW_LENGTH_END';

    this.current = this.WAITING_LENGTH;
    this.chunkLength = 0;
    this.content = [];
    this.finished = false;
  }

  // e\r\nHello World!!!\r\n0\r\n\r\n
  receiverChar(chunkChar) {
    if (this.current === this.WAITING_LENGTH) {
      if (chunkChar === '\r') {
        if (this.chunkLength === 0) {
          this.current = this.WAITING_NEW_LENGTH_END;
        } else {
          this.current = this.WAITING_LENGTH_END;
        }
      } else {
        this.chunkLength *= 16; // 保证每条chunk占满16位，默认16进制
        this.chunkLength += Number.parseInt(chunkChar, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_END) {
      if (chunkChar === '\n') {
        this.current = this.READING_CHUNK;
      }
    } else if (this.current === this.READING_CHUNK) {
      if (chunkChar === '\r') {
        this.current = this.WAITING_NEW_LENGTH;
      } else {
        this.content.push(chunkChar);
        this.chunkLength -= 1;
      }
    } else if (this.current === this.WAITING_NEW_LENGTH) {
      if (chunkChar === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    } else if (this.current === this.WAITING_NEW_LENGTH_END) {
      this.finished = true;
    }
  }
}

// 解析响应报文
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 'WAITING_STATUS_LINE';           // 行状态
    this.WAITING_STATUS_LINE_END = 'WAITING_STATUS_LINE_END';   // 结束状态
    this.WAITING_HEADER_NAME = 'WAITING_HEADER_NAME';           // 键状态
    this.WAITING_HEADER_SPACE = 'WAITING_HEADER_SPACE';         // 键值中间状态
    this.WAITING_HEADER_VALUE = 'WAITING_HEADER_VALUE';         // 值状态
    this.WAITING_HEADER_END = 'WAITING_HEADER_END';             // 结束状态
    this.WAITING_IDLE_LINE = 'WAITING_IDLE_LINE';               // 空行状态
    this.WAITING_BODY = 'WAITING_BODY';                         // 数据体状态

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';   // 记录行
    this.headers = {};      // 记录头
    this.headerName = '';
    this.headerValue = '';
    this.parser = null;
  }

  get isFinished() {
    return this.parser && this.parser.finished;
  }

  get response() {
    return this.parser && this.parser.content.join('');
  }

  receive(string) {
    // console.log('string: ', string);
    /**
     *  HTTP/1.1 200 OK
     Content-Type: text/html
     Date: Thu, 26 Nov 2020 14:48:48 GMT
     Connection: keep-alive
     Transfer-Encoding: chunked
     e
     Hello World!!!
     0
     */
    // 实际要处理的字符=======================================>
    // 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nDate: Thu, 26 Nov 2020 14:50:46 GMT\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n\r\ne\r\nHello World!!!\r\n0\r\n\r\n'
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITING_IDLE_LINE;
        // 根据Transfer-Encoding值解析body，这里只做chunked。chunked: 分段传输，长度未知，和content-length互斥。
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.parser = new ChunkedParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_END;
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      }
    } else if (this.current === this.WAITING_IDLE_LINE) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      // console.log(char);
      this.parser && this.parser.receiverChar(char);
    }
  }
}

// 连接服务器，拿到响应报文
class Request {
  constructor(options) {
    this.host = options.host;
    this.port = options.port || 80;
    this.method = options.method || 'GET';
    this.path = options.path || '/';
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      // 连接服务
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port,
        }, () => {
          // console.log('this.toString: ', this.toString());
          connection.write(this.toString());
        });

        connection.on('data', data => {
          console.log('=============== connection data ========');
          // console.log(data.toString());

          parser.receive(data.toString());
          if (parser.isFinished) {
            resolve(parser.response);
            connection.end();
          }
        });
        connection.on('error', err => {
          reject(err);
          connection.end();
        });
      }
    })
  }

  toString() {
    // 这里下面3句为了保证报文格式，置顶
    // 注意：这里的 \r \n 不要写错，否则会报400 Bad Request
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`;
  };
}

// 发送请求
void async function() {
  const request = new Request({
    host: '127.0.0.1',
    port: '8088',
    method: 'POST',
    path: '/',
    headers: {
      ['X-Foo2']: 'customed',
    },
    body: {
      name: 'markgong'
    },
  });
  const response = await request.send();
  // console.log('response:', response);
  const html = parser.parserHtml(response);
  console.log(util.inspect(html, {depth: null}));
}();
