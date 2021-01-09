import {h, Component} from './vue';

class Carousel extends Component {
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
        const RTPosition = position - ((x- x%500) / 500);

        for (const offset of [-1,0,1]) {
          let pos = RTPosition + offset
          pos = (pos%children.length + children.length)%children.length//用position偏置算出照片索引
          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x%500}px)`;
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


        // 露出右图只要选中current和current+1，露出左图只要选中current-1和current做transform
        // x<0则鼠标往左,x>0则鼠标往右
        // +1即露出右图：鼠标往左不满250 or 鼠标往右超过250，形式化表达就是 (x>0 && x-250>0) || (x<0 && x+250>0)
        // -1即露出左图：鼠标往右不满250 or 鼠标往左超过250，形式化表达就是 (x>0 && x-250<0) || (x<0 && x+250<0)
        // 结论是：Math.sign(x-250*Math.sign(x))
        
        for (const offset of [0,Math.sign(x-250*Math.sign(x))]) {
          let pos = position + offset
          pos = (pos%children.length + children.length)%children.length
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

let d = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];

let a = <Carousel id="a" src={d}></Carousel>;

a.mountTo(document.body);
