学习笔记


### /jsx/main.js
```
        next.style.transition = '' //相当于放弃js干预style

``` 



利用translateX轮播核心代码
```javascript
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      let current = children[currentIndex];// 0
      let next = children[nextIndex];// 1

      next.style.transition = 'none';
      next.style.transform = `translateX(${(-nextIndex + 1) * 100}%)`;
      setTimeout(() => {
        next.style.transition = ''; //

        current.style.transform = `translateX(${(-currentIndex -1) * 100}%)`;
        next.style.transform = `translateX(${(-nextIndex) * 100}%)`;// 从右向左移动/轮播

        currentIndex = nextIndex;
      }, 16);
    }, 3000);
```
