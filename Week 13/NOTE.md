学习笔记
 # 重学HTML和浏览器API
 
 
 ## HTML 定义
 
[https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd](https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd)

[https://www.w3.org/1999/xhtml/](https://www.w3.org/1999/xhtml/)
 namespace：(html、MathML、SVG）
 
## HTML标签语义

[https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element)
* aside 标签：元素表示一个和其余页面内容几乎无关的部分，被认为是独立于该内容的一部分并且可以被单独的拆分出来而不会使整体受影响。其通常表现为侧边栏或者标注框（call-out boxes）。
* mian：元素呈现了文档的 <body> 或应用的主体部分。主体部分由与文档直接相关，或者扩展于文档的中心主题、应用的主要功能部分的内容组成。
* article：元素表示文档、页面、应用或网站中的独立结构，其意在成为可独立分配的或可复用的结构，如在发布中，它可能是论坛帖子、杂志或新闻文章、博客、用户提交的评论、交互式组件，或者其他独立的内容项目。
* hgroup：element代表文档章节所属的多级别的目录，它将多个h1-6的子元素组装到一起
* 不了解某个标签处理语义的时候，会使用class
* strong：文章重要性
* em：重音
* figure： <figure> 元素代表一段独立的内容, 经常与说明（caption） <figcaption> 配合使用, 并且作为一个独立的引用单元。当它属于主内容流（main flow）时，它的位置独立于主体。这个标签经常是在主文中引用的图片，插图，表格，代码段等等，当这部分转移到附录中或者其他页面时不会影响到主体。
* hr： 元素表示段落级元素之间的主题转换
* ol：列表有顺序性
* ul：列表无顺序性
* nav：元素表示页面的一部分，其目的是在当前文档或其他文档中提供导航链接。导航部分的常见示例是菜单，目录和索引。
* pre：代码部分（元素表示预定义格式文本。在该元素中的文本通常按照原文件中的编排，以等宽字体的形式展现出来，文本中的空白符（比如空格和换行符）都会显示出来。(紧跟在 pre 开始标签后的换行符也会被省略)）
* samp：例子（元素用于标识计算机程序输出，通常使用浏览器缺省的 monotype 字体）

### html 语法

#### 合法元素
Element
Text
Comment
doucumentType
processingInstruction:<? a1 ?>
CDATA:<![CDATA[]]> 不需要考虑htm转义问题

#### 字符引用

&#161; 数字型引用
&amp; (&) &lt; (<)  &gt; (>)  &quot;  (")


## 浏览器API

### DOM API

#### 导航类操作

node级：

* parentNode
* childNodes
* firstChild
* lastChild
* nextSibling
* previousSibling

element：

* parentElement
* children
* firstElementChild
* lastElementChild
* nextElementSibling
* previousElementSibling
* 

#### 修改操作

* appendChild
* insertBefore
* removeChild
* replaceChild
* 

#### 高级操作

* compareDocumentPosition: 比较两个阶段中关系函数
* contians：检查一个节点是否包含另一个节点函数
* isEqulaNode：检查两个节点是否完全相同
* isSameNode：检查两个节点是否是同一个节点，实际上在javascript中可以用”===“
* cloneNode: 复制节点，如果传入参数true，则会连同子元素深拷贝


### 事件API
[https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

```
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
target.addEventListener(type, listener, useCapture, wantsUntrusted  ); 

```

### Range API

创建Range

var range = new Range();
range.setStart(element, 9)
range.setEnd(element, 4)
var range = document.getSelection().getRangeAt(0)


Range.setStartBefore()
Range.setStartAfter()
Range.setEndBefore()
Range.setEndAfter()
Range.selectNode()
Range.selectNodeContents()
[https://developer.mozilla.org/en-US/docs/Web/API/Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)


练习：把一个元素所有子元素元素逆序

```
<div id="a">
<span>1</span>
<p>2</p>
<a>3</a>
<div>4</div>
</div>

<script>
    let element = document.getElementById("a");
    function reverseChildren(element) {
    
        let range = new Range();
        range.selectNodeConents(element);
        let fragment = range.extractContexts();
        var l = fragment.childNodes.length;
        while(l--  >0) {
            fragment.appendChild(fragment.childNodes[l];
        }
        element.appendChild(fragment);
    }
    reverseChildren(element);
</script>

```

### CSSOM

#### style link 两种形式

* document.styleSheets[0].cssRules
* document.styleSheets[0].insertRule("p {color: pink;}", 0);
* document.styleSheets[0].removeRule(0)

#### Rule

* CSSStyleRule
    * selectorText String
    * style K-V 结构
* CSSCharsetRule
* CSSImportRule
* CSSMediaRule
* CSSFontFaceRule
* CSSPageRule
* CSSNamespaceRule
* CSSKeyframesRule
* CSSKeyFrameRule
* CSSSupportsRule
* 其他

**getComputedStyle
window.getComputedStyle(elt,pseudoElt)
elt想要获取的元素
psesudoElt 可选，伪元素**

### CSSOM view
#### window 

* window.innerHeight,Window.innerWidth,window.outerWidth, window.outerHeight,windwo.devicePixelRatio
* window.screen: 
    * window.screen.width
    * window.screen.height
    * window.screen.availWidth
    * windwo.screen.availHeight

    
devicePixelRatio:接口的devicePixelRatio返回当前显示设备的物理像素分辨率与CSS像素分辨率之比。 此值也可以解释为像素大小的比率：一个CSS像素的大小与一个物理像素的大小。 简单来说，它告诉浏览器应使用多少屏幕实际像素来绘制单个CSS像素

* windwo.open("about:blank", "blank","width=100",height=100,left=100,right=100")
* moveTo(x,y)
* moveBy(x,y)
* resizeTo(x,y)
* resizeBy(x,y)

### scroll

* scrollTop
* scrollLeft
* scrollWidth
* scrollHeight
* scroll(x,y)
* scrollBy(x,y)
* scrollIntoView()
* 
* Window.scrollX()
* window.scrollY()
* window.scroll(x,y)
* window.scrollBy(x,y)

### layout

* getClientRects() 兼容性好
* getBoundingClientRect()  兼容性好

### 其他API

API来源：
* khronos:WebGL
* ECMA:ECMAScript
* WHATWG:HTML
* W3C: webaudio、CG（社区）/WG（工作组）

全部API的分类和整理

[https://spec.whatwg.org/](https://spec.whatwg.org/)