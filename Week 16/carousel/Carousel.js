import {Component} from './vue';
import {enableGesture} from './gesture/main';
import {Animation, Timeline} from './animation/animation';
import {ease, easeIn} from './animation/ease';

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
    enableGesture(this.root);
    let tl = new Timeline();
    tl.start();
    let nextPicture = () => {
      console.log('nextP');
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;

      let current = children[position];// 0
      let next = children[nextIndex];// 1

      t = Date.now();

      tl.add(
          new Animation(
              current.style,
              'transform',
              (-position) * 500,
              (-position - 1) * 500,
              500,
              0,
              ease,
              v => `translateX(${v}px)`,
          ),
      );
      tl.add(
          new Animation(
              next.style,
              'transform',
              (-nextIndex + 1) * 500,
              (-nextIndex) * 500,
              500,
              0,
              ease,
              v => `translateX(${v}px)`,
          ),
      );
      position = nextIndex;// (500 - ax)的原因

    };

    let handler = null;

    let children = this.root.children;
    let position = 0;

    let t = 0;
    let ax = 0;
    this.root.addEventListener('start', (event) => {
      console.log('start');
      tl.pause();
      clearInterval(handler);

      let progress = (Date.now() - t) / 500;
      ax = 500 - ease(progress) * 500;
    });

    this.root.addEventListener('pan', (event) => {
      let x = ax + (event.clientX - event.startX);

      // ((x- x%500) / 500) = 0或1或2...往右移position是减1,2...
      // 实时得出当前的position偏置，用于判断选中哪个照片做transform
      const RTPosition = position - ((x - x % 500) / 500);

      for (const offset of [-1, 0, 1]) {
        let pos = RTPosition + offset;
        pos = (pos % children.length + children.length) % children.length;//用position偏置算出照片索引

        children[pos].style.transform = `translateX(${-pos * 500 + offset *
        500 + x % 500}px)`;
      }
    });
    this.root.addEventListener('tap', (event) => {
      console.log('tap');
      setInterval(nextPicture, 3000);
      tl.reset();
      tl.start();
    });

    this.root.addEventListener('panend', (event) => {
      tl.reset();
      tl.start();

      let x = ax + (event.clientX - event.startX);

      const RTPosition = position - ((x - x % 500) / 500);
      const direction = Math.round((x % 500) / 500);
      for (const offset of [-1, 0, 1]) {
        let pos = RTPosition + offset;
        pos = (pos % children.length + children.length) % children.length;//用position偏置算出照片索引

        tl.add(
            new Animation(
                children[pos].style,
                'transform',
                -pos * 500 + offset * 500 + x % 500,
                -pos * 500 + offset * 500 + direction * 500,// 重点
                500,
                0,
                ease,
                v => `translateX(${v}px)`,
            ),
        );

      }
      position = RTPosition - direction;
      position = (position % children.length + children.length) %
          children.length;//用position偏置算出照片索引

    });

    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
