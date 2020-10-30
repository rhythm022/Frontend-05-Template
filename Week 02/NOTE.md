学习笔记



### 5.html
浅拷贝
```javascript
    this.data = data.slice();
```


避免splice的删除操作时间复杂度O(n)：
```javascript
    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()
```


###  callback 授人以摸鱼
初始化变量的最佳实践
```javascript
let map =(function() {
          let saved = localStorage['map']
          if(saved){
            return JSON.parse(saved)
          }
          else{
            return Array(10000).fill(0)
          }
        })()
```
