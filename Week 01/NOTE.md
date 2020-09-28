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