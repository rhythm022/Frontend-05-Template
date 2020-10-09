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

