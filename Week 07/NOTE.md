学习笔记

### Type Convertion 类型转换

|      原始值      | 转换为 Number |   转换为 String   | 转换为 Boolean |
| :--------------: | :-----------: | :---------------: | :------------: |
|      false       |       0       |      "false"      |     false      |
|       true       |       1       |      "true"       |      true      |
|        0         |       0       |        "0"        |     false      |
|        1         |       1       |        "1"        |      true      |
|       "0"        |       0       |        "0"        |      true      |
|       "1"        |       1       |        "1"        |      true      |
|       NaN        |      NaN      |       "NaN"       |     false      |
|     Infinity     |   Infinity    |    "Infinity"     |      true      |
|    -Infinity     |   -Infinity   |    "-Infinity"    |      true      |
|        ""        |       0       |        ""         |     false      |
|       "20"       |      20       |       "20"        |      true      |
|     "twenty"     |      NaN      |     "twenty"      |      true      |
|        []        |       0       |        ""         |      true      |
|       [20]       |      20       |       "20"        |      true      |
|     [10,20]      |      NaN      |      "10,20"      |      true      |
|    ["twenty"]    |      NaN      |     "twenty"      |      true      |
| ["ten","twenty"] |      NaN      |   "ten,twenty"    |      true      |
|   function(){}   |      NaN      |  "function(){}"   |      true      |
|        {}        |      NaN      | "[object Object]" |      true      |
|       null       |       0       |      "null"       |     false      |
|    undefined     |      NaN      |    "undefined"    |     false      |

### Unboxing（拆箱转换）

-   `ToPremitive`
    -   如遇到 `object` 参与运算，如 `object + object` 时，都会调用 `ToPremitive` 过程。
-   `toString vs valueOf`
    -   加法会优先调用 `valueOf` 方法，即使是字符串+对象，如 `'x' + o`，如果没有 `valueOf` 和 `Symbol.toPrimitive` 方法才会调用 `toString`，但是当 `object` 作为属性名的时候则会优先调用 `toString` 方法，如`x[o]`。
-   `Symbol.toPrimitives`
    -   优先级最高，如果调用了该方法，则会忽略 `toString` 和 `valueOf` 方法。

### Boxing（装箱转换）

| 类型    | 对象                    | 值          |
| ------- | ----------------------- | ----------- |
| Number  | new Number(1)           | 1           |
| String  | new String('a')         | 'a'         |
| Boolean | new Boolean(true)       | true        |
| Symbol  | new Object(Symbol('a')) | Symbol('a') |

> 若用 Member 运算符或者方括号去访问属性时，若被访问者是一个基础类型，则会自动调用装箱转换，如 `1 .tostring()`，1 后面必须有空格。原因：

```js
// 下面的测试案例是 https://www.jianshu.com/p/71d8d56f60b0 这位大佬的文章里摘抄并修改的。
1toString() // 报错，语法错误
1.toString() // 报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1..toString() // 成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的点是浮点数。
1.0.toString() // 成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的点是浮点数。
1 .toString() // 成功，运算结果"1" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
1['toString']() // 成功，运算结果“1” 解析：1会执行装箱操作调用new Number(1)之后在Number类中查找toString函数并执行
1 + 2.toString() // 报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1 + 2 .toString() // 成功，运算结果"12" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
(1 + 2).toString() // 成功，运算结果"3" 解析: 括号内部的先进行算法运算，在进行类型转换
(1) + (2).toString() // 运算s结果"12" 解析: 括号内部进行类型修改并将数字n转换为字符串“n “，在进行拼接，然后再应用toString方法。
(1) + (2) + 0 .toString() // 成功，运算结果"30" 解析: 如果有多个`+`号，且不包含中括号与""的情况下，则把最后一个加号之前的进行数学运算(不管他有没有被括号包住)，最后一个加号留作拼接作用。
(1) + (2) + 0 + (11) .toString() // 成功，运算结果"311" 解析: 同上
(1) + (2) + 0 + 12 .toString() // 成功，运算结果"312" 解析: 同上
([1] + [2] + [3]) + 12 .toString() // 成功，运算结果"12312" 解析: 如果里面只有方括号(单个数值的数组)，则+起连接作用
((1) + (2) + [3]) + 12 + 43 .toString() // 成功，运算结果"331243" 解析: 如果里面包含圆括号，则先要进行运算，再把运算的结果与后面的内容拼接起来。
(1) + (2) + 6 + 2 + 5 + "(15)" + 1 + 0 + (1) .toString() // 成功，运算结果"16(15)101"解析: 如果字符串包裹的前面有多个加号，则把字符串双引号前面的进行运算(不管他有没有被圆括号包住)，得到的数值拼接上字符串包裹的内容再拼接上之后的内容。
```

> `number 类型`和 `number 类`不是同一个东西，我们可以通过 `typeof` 进行区分

```js
console.log(typeof new Number(1)) // object
console.log(typeof 1) // number
```






## 运算符和表达式

### Expression

-   `Member`（由于搜索 `js` `Member` 运算符搜索不到，所以这里叫类似 `C++` 的成员运算符吧）
    -   `a.b`
    -   `a[b]`
    -   **foo\`string`**
        -   我搜了一下，这个东西叫标签函数，利用自定义函数处理模板字符串，函数的第一个参数是根据`${}`位置切割开的字符串数组，模板字符串的头和尾如果有`${}`则会多切割一个空串放进数组，后面所有的参数是`${}`的内容，有几个`${}`，后续参数就有多少，我用`...`扩展运算符放到数组里了（见下方代码示例）。
    -   `super.b`
    -   `super['b']`
    -   `new.target`
        -   在普通的函数调用中（和作为构造函数来调用相对），`new.target` 的值是 `undefined`（见下方代码示例）。
        -   在类的构造方法中，`new.target` 指向直接被 `new` 执行的构造函数（见下方代码示例）。
    -   `new Foo()`

> 以上七种表达式的优先级都是相同的

-   `New`
    -   `new Foo`

> 不加括号的 `new` 优先级比上面七种低，详情见下方代码最后一部分的举例打印。

```js
const a = { b: 1 }
const b = 'b'
const foo1 = (string, exp1, exp2) => [string, exp1, exp2]
const foo2 = (string, ...exp) => [string, exp]

console.log(a.b) // 1
console.log(a[b]) // 1
console.log(foo1`string${1}number${2}`) // [ [ 'string', 'number', '' ], 1, 2 ]
console.log(foo2`string${1}number${2}boolean`) // [ [ 'string', 'number', 'boolean' ], [ 1, 2 ] ]

class Dog {
	get b() {
		return 'WangWangWang!'
	}
}
class BlackDog extends Dog {
	call() {
		console.log(super.b) // WangWangWang!
		console.log(super['b']) // WangWangWang!
	}
}
new BlackDog().call()

// new.target 下方示例摘抄与MDN中

// 函数调用中的 new.target，测试函数是否是被 new 关键字调用
function Foo() {
	// if (!new.target) throw 'Foo() must be called with new'
	console.log('Foo instantiated with new')
}
Foo() // throws "Foo() must be called with new"
new Foo() // logs "Foo instantiated with new"

// 构造方法中的 new.target，方法指向初始化类的类定义
class A {
	constructor() {
		console.log(new.target.name)
	}
}
class B extends A {
	constructor() {
		super()
	}
}
var a1 = new A() // logs "A"
var b1 = new B() // logs "B"
class C {
	constructor() {
		console.log(new.target)
	}
}
class D extends C {
	constructor() {
		super()
	}
}
var c1 = new C() // logs class C{constructor(){console.log(new.target);}}
var d1 = new D() // logs class D extends C{constructor(){super();}}

// new Foo 和 new Foo()的优先级比较
function Foo2() {
	return () => ({ a: 1 })
}
// new Foo2()()
console.log(new Foo2()())
// 根据打印结果看出，如果先执行 Foo2() 返回一个箭头函数，那么第二部执行new操作是会报错的，所以是先执行了new 操作符 // 问题：上式的执行顺序是 new [Foo2()] () 还是 [new Foo2()] ()，方括号括起来的部分为先执行的部分
// 即可以判断出new + 括号的运算符的优先级更高，之后才是函数执行。

// new new a()
// console.log(new new a())
// 问题：上述语句的括号是先和第一个new结合还是和第二个new结合
// 从上一个示例看出带括号的new优先级更高，所以括号会先和第二个new结合，之后变成new Foo再继续执行，所以new Foo的优先级低。
```

### Runtime 运行时的引用类型（Reference）

> a.b 操作访问了对象的属性，但是它从对象中取出来的可不是对象的值，而是一个引用，但引用不是 JS 的七种基本类型之一，但它确确实实存在于运行时，我们称它为标准中的类型而不是语言中的类型，一个 Reference 又两部分组成，第一部分是一个对象，第二部分是一个 key，对象就是 object，key 可以是 String 也可以是 Symbol，在处理 delete 或者 assign 相关的写操作时，就要知道操作的是哪个对象的哪个属性，即用到的引用类型。

-   `Call`（函数调用）
    -   `foo()`
    -   `super()`
    -   `foo()['b']`
    -   `foo().b`
    -   foo()\`abc\`

> `Call Expression` 的优先级没有上述 `Member` 和 `New` 的优先级高，所以导致后面的 `Member` 运算符的优先级也降低了，点运算的优先级是由它前面的表达式决定的。

> `new a()['b']`的优先级顺序是先 new 再取值

```js
const foo3 = () => (string, ...exp) => [string, ...exp]
// 和上方标签函数解析规则一样
console.log(foo3()`abc`) // [ [ 'abc' ] ]
```

-   Left Handside & Right Handside（左手运算和右手运算）

> 如果能放到等号左边的表达式就是 `Left Handside Expression`，比如`a.b`，否则就是 `Right Handside Expression`，比如`a+b`。并且`Left Handside Expression`一定是`Right Handside Expression`。

-   `Update`
    -   `a++`
    -   `a--`
    -   `--a`
    -   `++a`

> `Update Expression` 就是 `Right Handside Expression`，`++ a ++` 是不合法的。

-   `Unary`（单目运算符）

    -   `delete a.b`
    -   `void foo()`
        -   `void` 运算符对给定的表达式进行求值，然后返回 `undefined`。
    -   `typeof a`
    -   `+a`
        -   如果是字符串会发生类型转换转为数字
    -   `-a`
        -   同上
    -   `~a`
        -   按位取反，如果 `a` 不是整数，会把 `a` 强制转换为整数之后再按位取反。
    -   `!a`
    -   `await a`
        -   返回一个 Promise

-   `Exponential`（指数运算符）
    -   `\*\*`
        -   表示乘方运算

> `3 ** 2 ** 3` 的运算顺序是 `3 ** (2 ** 3)`从右到左。大部分运算符都是左结合的，唯有 `**` 是右结合的。

-   `Multiplicative`（乘法运算符）
    -   `\* / %`
-   `Additive`（加法运算符）
    -   `+ -`
-   `Shift`（移位运算符）
    -   `<< >> >>>`
-   `Relationship`(关系运算符)
    -   `< > <= >= instanceof in`
-   `Equality`（相等运算符）
    -   `==`
        -   转换规则见下集详解
    -   `!=`
    -   `===`
    -   `!==`
-   `Bitwise`（位运算符）
    -   `& ^ |`
-   `Logical`（逻辑运算符）
    -   `&&`
    -   `||`
-   `Conditional`（条件运算符）
    -   `? :`
