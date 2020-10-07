学习笔记

### 2.html
inline-block默认的对其方式是baseline，所以搭配vertical-align:middle食用：
```
        display: inline-block;
        vertical-align: middle;
```



连续简单判断的最佳实践
```
  cell.innerText = 
    pattern[j][i] == 2 ? '❌' :
    pattern[j][i] == 1 ? '⭕' : '';
```



换行的最佳实践，改进了通过设置父元素width强制子元素换行的思路：
```
board.appendChild(document.createElement('br'))
```


### 3.html
重置一个元素的简单方法：
```
board.innerHTML = "" 
```



### 4.html

有时候，双层循环可以与单层循环等价：
```
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
            }
        }

            for (let i = 0; i < 9; i++) {
        }
```


反复使用同一变量名的小技巧：
```
    {
            let win =true
            for (let j = 0; j < 3; j++) {
                if (pattern[j][j]) {
                    win =false
                }                
            }
            if(win) 
                return true
        }
        {
            let win =true
            for (let j = 0; j < 3; j++) {
                if (pattern[j][2 - j]) {
                    win =false
                }                
            }
            if(win) 
                return true
        }
```



### 5.html

使用序列化反序列化的方式clone：
```
function clone(pattern){
    return JSON.parse(JSON.stringify(pattern))
}

```



### 7.html
pattern二维数组和普通数组是等价的
```
pattern[j*3 + i]等价于pattern[j][i]
pattern[i*3 + j]等价于pattern[i][j]
pattern[i*3 + 2 - j]等价于pattern[i][2-j]

```



### 8.html
`Object.create(pattern)`可以继承pattern的方法和数据，而比`JSON.parse(JSON.stringify(pattern))`更省内存
```
    function clone(pattern) {// new add
        return Object.create(pattern)
    }
```

### redgreen.html
假设Promise某异步行为并装配一连串then行为中，没有任一then行为return new Promise，then()则顺序执行下去，否则，如果中间有一then行为return new Promise的，则接下来then行为以这个新的Promise为Promise，这称之为Promise链式调用机制。


async关键字的意义仅仅是配合await关键字，并且async函数隐式返回Promise.resolve()，这两点是async函数有别于同步函数的特征：
```javascript
  async function returnPromiseResolve() {
    console.log('A1');
  }
  function returnUndefined() {
    console.log('A1');
  }

  async function returnPromiseImmediate2() {
    await sleep(1000);
  }

  async function returnPromiseImmediate3() {
    sleep(1000);
  }
```



await调用可以调用任何函数，同步的/异步的/返回Promise的/返回null的，await调用会等待到这些函数return，这没什么特别的，特别的在于，如果这些函数返回Promise，await调用还要等待Promise的结果后再继续执行：

```javascript
  function returnForeverPending() {
    return new Promise(resolve => {
      console.log('A1');
    });
  }
  async function ASNYC__returnForeverPending() { // 等价returnForeverPending函数，只返回时return Promise的函数加不加async关键字没有任何区别
    return new Promise(resolve => {
      console.log('A1');
    });
  }



  function normalCall() {
    returnForeverPending().then(() => {
      console.log('A2');
    });
  }

  async function asyncCall() {
    await returnForeverPending();
    console.log('A2');
  }
```

```javascript
  function happen(){
    return new Promise(resolve => {
      let listener = document.getElementsByTagName('button')[0]
      listener.addEventListener('click',resolve,{once:true})
    })
  }
  async function go() {
    while (true) {
      green();
      await happen();

      yellow();
      await happen();

      red();
      await happen();

    }

  }
```
