学习笔记


## 手势动画应用

- **mouse 事件**
  - `mousestart` 监听在 `element` 元素上
  - `mousemove & mouseend` 监听在 `document` 上
- **touchmove & touchend:**

  - 不管你触摸屏幕后，手指是在目标元素上还是滑出目标元素， target 属性的值都不会变

  ```jsx
  <div id="a"></div>
  <div id="b"></div>
  a.addEventListener('touchend',()=>{console.log('a touchend!')})
  b.addEventListener('touchend',()=>{console.log('b touchend!')})
  /*
  ** 手指由 a区域 =》b区域，最终在 b区域 离开屏幕
  ** console: "a touched!"
  */
  ```

#### review 一下组件项目

- **元素 layout**
  - 正常流 `inline-block` 排列轮播元素
  - 通过 `translateX ( - position * width ) ` 顺时针自动轮播
- **管理动画和时间线 animation&timeline**
  - Timeline
    - add
    - start
    - pause
    - resume
    - reset
  - Animation
    - `new Animation(object, property, startValue, endValue, delay, timingFunction, template)`
    - receiveTime
      - progress = time / duration
- **统一手势 gestrue**
  - Mouse Event: mousedown, mousemove, mouseup
  - Touch Event: touchstart, touchmove, touchup
  - 自定义手势：
    - press-start
    - press-end
    - tap
    - pan-start
    - pan-move
    - pan-end
    - flick
  - 自定义事件
    - `new Event`
    - start
    - end
- **整合动画和手势**
- **优化父子组件结构**

  - 使我们写组件时，专注于 render 方法
    - 整理函数作用域内的变量/方法
    - 细分通用变量（方法）/内部变量（方法）
    - ```js
      this.attribute = Object.create(null);
      setAttribute(name,value){}
      mountTo(){};
      ```

- **添加状态机制**: protected
  - 私有 - symbol
  - 公有 - 挂载到 this
- **添加更多属性**

### 其他

- **继承**
  - 访问控制和继承
    |访问 |public| protected| private|
    |-----|-----|----|---|
    |同一个类 |yes |yes| yes|
    |派生类| yes |yes |no|
    |外部的类 |yes |no| no|
  - 继承类型
    - **`公有继承（public）：`**
      - 当一个类派生自**公有**基类时，
      - 基类的**公有成员**也是派生类的**公有成员**，
      - 基类的**保护成员**也是派生类的**保护成员**，
      - 基类的**私有成员**不能直接被派生类访问，但是可以通过调用基类的公有和保护成员来访问。
    - **`私有继承（private）：`**
      - 当一个类派生自**保护**基类时，
      - 基类的**公有和保护成员**将成为派生类的**保护成员**。
    - **`保护继承（protected）：`**
      - 当一个类派生自**私有**基类时，
      - 基类的**公有和保护成员**将成为派生类的**私有成员**。
- **回调**
  - 举个例子：
    - 酒店提供 morning call 服务，但客人可以选择 morning call 的方式
    1. **library function（库函数）**：morning call 的行为（是酒店提供的）
    2. **回调函数**：客人选择的方式是
    3. **登记回调函数**：客人告知酒店的行为是
       ![](https://pic3.zhimg.com/80/0ef3106510e2e1630eb49744362999f8_1440w.jpg?source=1940ef5c)
- JSX 组件中的 children
  - 内容型：所见即所得
    ```jsx
    let btn = <Button>btn</Button>;
    ```
  - 模版型
    ```jsx
    let list = (
      <List data={list}>
        {(record) => (
          <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
          </div>
        )}
      </List>
    );
    ```