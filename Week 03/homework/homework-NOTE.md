学习笔记



### 4.html
对应第一节课讲的产生式：  
单独的乘法是一种加法。并且加法是可以连加的，用产生式表示就是：
```
<AdditiveExpression>::=
    <MultiplicativeExpression>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
```
所以，1 * 2在底层被认为是乘法，在上层被认为是加法。

单独的数字是一种乘法。并且加法是可以连乘的，用产生式表示就是：
```
<MultiplicativeExpression>::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
```


###5.html
把AdditiveExpression产生式中的第一行展开，就是：  
```
<AdditiveExpression>::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
```














