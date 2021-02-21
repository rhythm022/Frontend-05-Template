学习笔记

## 整体架构
1. 线上服务系统：给用户提供线上服务
2. 发布系统：向线上服务系统发布程序
3. 发布工具：将程序上传到发布系统，由发布系统发布内容

流程：发布工具 -> 发布系统 -> 线上服务系统

## 搭建服务器
### 使用虚拟机模拟服务器

工具：
1. Oracle VM VirtualBox 下载地址： https://www.virtualbox.org/
2. Ubuntu 20.04.1 LTS (Focal Fossa) 下载地址：https://releases.ubuntu.com/20.04/

ps:
> 镜像地址使用：http://mirrors.aliyun.com/ubuntu  
> 默认安装 openSSH 

### 服务器环境配置
安装 node：```sudo apt install nodejs```   
安装 npm：```sudo apt install npm```

## 线上服务系统
### 构建项目
使用 express-generator 快速生成一个简单前端项目(/server)

### 线上服务系统部署
1. 在服务器启动 ssh，默认在 22 端口监听
2. 虚拟机需要做 22 端口映射，示例映射为 8022
3. 在服务器创建 server 文件夹
4. 执行 scp 命令，将前端项目文件拷贝到服务器 server 文件夹下

一些命令：
```bash
# 启动 ssh
service ssh start

# 拷贝文件 ./* 到指定路径 /home/skye/server
# 127.0.0.1 表示服务器 ip 地址
scp -P 8022 -r ./* skye@127.0.0.1:/home/skye/server  
```

## 发布系统 (publish-server/server.js)
```javascript
let http = require("http");
let unzipper = require("unzipper");

// 发布系统
http.createServer(function(request, response) {
    // 接收 发布工具 传过来的压缩包文件，解压缩到服务器目标文件夹下：server/public/
    request.pipe(unzipper.Extract({path: '../server/public/'}));
}).listen(8082)

```
## 发布工具 (publish-tool/publish.js)
```javascript
let http = require("http");
let archiver = require("archiver");

// 发布工具
let request = http.request({
    hostname: "127.0.0.1",  // 发布系统 ip 地址
    port: 8082,  // 发布系统监听端口
    method: "POST",
    headers: {
        'Content-type': 'application/octet-stream'
        // 'Content-length': stat.size
    }
}, response => {
    console.log(response)
});

// 创建压缩文件对象
const archive = archiver('zip', {
    zlib: { level: 9 }
});

// 压缩文件夹
archive.directory('./simple/', false);

// 表示压缩完成
archive.finalize();

// 传输压缩文件
archive.pipe(request);
```

## 用GitHub oAuth做一个登录实例
1. 打开 https://github.com/login/oauth/authorize  - publish-tool
2. auth 路由：接收 code，用 code + client_id + client_secret 换 token  - publish-server
3. 创建 server，接受 token，后点击发布  - publish-tool
4. publish 路由：用 token 获取用户信息，检查权限，接受发布  - publish-server


## 参考文档
1. [node 流式传输](https://nodejs.org/docs/latest-v13.x/api/stream.html#stream_class_stream_readable)
2. [用GitHub oAuth做一个登录实例](https://docs.github.com/en/developers/apps/getting-started-with-apps)
