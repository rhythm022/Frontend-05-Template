学习笔记


为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

first-letter是在布局完成之后，确定了一段文字中的第一个文字，可以对其操作布局时性能开销小； 而first-line选中的是第一行文字，不同的宽度选中的文字内容不一样，要对其重新布局排版消耗性能大,所以first-letter 可以设置 float 之类的，而 first-line 不行。


### 伪类：

- 行为：
:any-link
:link :visited
:hover
:active
:target
:focus
...

- 结构
:empty
:nth-child()
:nth-last-child()
:first-child :last-child :only-child
...

- 逻辑
:not()
:where :has

### 伪元素

::before
::after
::first-line: 本质是将第一行**文字**用一个<::first-line>将第一行括起来

    生效属性:
        font系列
        color系列
        background系列
        word-spacing
        letter-spacing
        text-decoration
        text-transform
        line-height

::first-letter: 本质是将第一个**文字**用一个<::first-line>将第一行括起来

    生效属性
        font系列
        color系列
        background系列
        text-decoratin
        text-transform
        letter-spacing
        word-spacing
        line-height
        float
        vertical-align
        盒模型：margin,padding,border
