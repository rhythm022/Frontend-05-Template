import {Component} from './vue';

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const src of this.attributes.src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url('${src}')`;
      this.root.appendChild(child);
    }
    let position = 0;

    this.root.addEventListener('mousedown', (event) => {
      console.log('down');
      let children = this.root.children;
      let startX = event.clientX;

      const move = (event) => {
        console.log('move');
        let x = event.clientX - startX;

        // ((x- x%500) / 500) = 0或1或2...往右移position是减1,2...
        // 实时得出当前的position偏置，用于判断选中哪个照片做transform
        const RTPosition = position - ((x - x % 500) / 500);

        for (const offset of [-1, 0, 1]) {
          let pos = RTPosition + offset
          pos = (pos % children.length + children.length) % children.length//用position偏置算出照片索引
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
        }

      };

      const up = (event) => {
        console.log('up');
        let x = event.clientX - startX;
        // 因为position是从0开始的，先考虑right右移，move up后position更新为-1，
        // 则此时，展示的照片的索引肯定为3，即 length - 1 即 length + position，继续右移，length - 1到length - 2到length - 4到length - 0
        // 所以 length + position 重构为 length + position%length
        // 再考虑position从0开始left左移，一直左移，position从0更新到1到2到3到0，可以表示为position%length = (length + position)%length
        // 把左移和右移情况的公式合并成一个公式，则 length + position%length 重构为 (length + position%length)%length
        // 结论是：position偏置决定了current展示照片的索引，current照片索引可以用公式 (length + position%length)%length 表示
        position = position - Math.round(x / 500);//鼠标右移👉position为减1，鼠标左移👈position加1


        // 露出右图只要选中current和current+1做transform，露出左图只要选中current-1和current做transform
        // x<0则鼠标往左,x>0则鼠标往右
        // +1即稍露出右图（松手current往右移，右图消失）：鼠标往左时x%500绝对值处于[0,250] or 鼠标往右时x%500绝对值处于[250,500]
        // -1即稍露出左图（松手current往左移，左图消失）：鼠标往右时x%500绝对值处于[0,250] or 鼠标往左时x%500绝对值处于[250,500]
        // 推翻结论：Math.sign(x-250*Math.sign(x))

        let sign
        if (x <= 0 &&
            0 <=Math.abs(x % 500) &&
            Math.abs(x % 500) < 250
        ) {
          sign = +1
        }
        if (x > 0 &&
            250 < x % 500 &&
            x % 500 < 500
        ) {
          sign = +1
        }

        if (x > 0 &&
            0 < x % 500 &&
            x % 500 < 250
        ) {
          sign = -1
        }

        if (x < 0 &&
            250 <Math.abs(x % 500) &&
            Math.abs(x % 500) < 500
        ) {
          sign = -1
        }

        for (const offset of [0, sign]) {
          let pos = position + offset
          pos = (pos % children.length + children.length) % children.length
          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    //
    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = (currentIndex + 1) % children.length;
    //
    //   let current = children[currentIndex];// 0
    //   let next = children[nextIndex];// 1
    //
    //   next.style.transition = 'none';
    //   next.style.transform = `translateX(${(-nextIndex + 1) * 100}%)`;
    //   setTimeout(() => {
    //     next.style.transition = ''; //
    //
    //     current.style.transform = `translateX(${(-currentIndex -1) * 100}%)`;
    //     next.style.transform = `translateX(${(-nextIndex) * 100}%)`;// 从右向左移动/轮播
    //
    //     currentIndex = nextIndex;
    //   }, 16);
    // }, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
