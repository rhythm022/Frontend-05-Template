学习笔记


###
Proxy多用在库的开发中，不建议在业务代码中使用Proxy。使用Proxy会使代码预期性变差


proxy和defineProperty的最大区别是，前者对于所监听对象的不存在属性也会触发getter，setter




### x2.html
x1中监听后的执行逻辑是直接编码在setter/getter中的，x2中用了回调钩子把执行逻辑分离出setter/getter，降低了耦合，这中间需要存储和读取钩子数据，这一班用了全局的数据结构存储钩子数据



### x3.html
x3在x2的基础上，为每一个po的每个p建立了自己的存储单元，存储钩子数据。  

Map可以以object为key建立映射：
```javascript
   let callbacks = new Map()
```

语法简化：
```javascript
 if(callbacks.get(po))
   if(callbacks.get(po).get(p))
     for (let cb of callbacks.get(po).get(p)) 
       cb()
     
```

查找一个元素，要么遍历，要么建立索引后根据索引查找



### x4.html
reactive的基础设施：
+ 变量变成po变量，通过Proxy
+ 储存钩子，通过effect



### x5.html
光有reactivity是单向绑定。  
改变DOM元素的值不会触发事件机制。

Vue3.0的Reactivity feature的应用：
+ 负责数据到DOM元素的这一条线的effect（从DOM元素到数据的这一条线的effect，很简单用原生的Event feature）
+ 负责数据到其他任何原生对象的effect


### y1.html
(clientX,clientY)是鼠标坐标，以窗口左上角为(0,0)

transform:translate(a,b)指定元素块左上角像素点的坐标，也以窗口左上角为(0,0)
