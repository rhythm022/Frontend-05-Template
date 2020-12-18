学习笔记




### layout.js
先正常情况处理，特殊情况的处理结果直接覆盖正常情况处理的结果
```javascript
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
```


对带单位数字字符串进行转换
```javascript
parseInt(element.style[prop]);
```


获取最大值
```javascript
        crossSpace = Math.max(crossSpace,itemStyle[crossSize])

```

有剩余空间时，拥有flex属性的元素根据本行的剩余空间决定自己的宽度。
多个flex元素按定义的比例决定宽度。
当有剩余空间但没有flex元素，justifyContent开始发挥作用。
当no-wrap且无剩余空间则flex元素宽度为0，普通元素按比例压缩自己的宽度。



justifyContent:行的主方向
alignContent:行的纵方向
alignSelf/父alignItems：元素的行内纵方向
















































