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
        for (const child of children) {
          child.style.transition = 'none';
          child.style.transform = `translateX(${-position * 500 + x}px)`;
        }
      };

      const up = (event) => {
        console.log('up');
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);//加减1，鼠标向右position为减

        for (const child of children) {
          child.style.transition = '';
          child.style.transform = `translateX(${-position * 500}px)`;
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
