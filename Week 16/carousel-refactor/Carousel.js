import { Component, STATE, ATTRIBUTE } from './vue';
import { enableGesture } from './gesture/main';
import { Animation, Timeline } from './animation/animation';
import { ease } from './animation/ease';
export { STATE, ATTRIBUTE } from './vue'

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (const src of this[ATTRIBUTE].src) {
      const child = document.createElement('div');
      child.style.backgroundImage = `url('${src.img}')`;
      this.root.appendChild(child);
    }
    enableGesture(this.root);
    let tl = new Timeline();
    tl.start();


    let handler = null;

    let children = this.root.children;
    this[STATE].position = 0;

    let t = null;
    let ax = 0;

    let nextPicture = () => {
      let nextPosition = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];// 0
      let next = children[nextPosition];// 1

      t = Date.now();

      tl.add(
        new Animation(
          current.style,
          'transform',
          (-this[STATE].position) * 500,
          (-this[STATE].position - 1) * 500,//向左
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
          (-nextPosition + 1) * 500,
          (-nextPosition) * 500,
          500,
          0,
          ease,
          v => `translateX(${v}px)`,
        ),
      );

      this[STATE].position = nextPosition;// (500 - ax)的原因
      this.triggerEvent('change', {
        position: this[STATE].position
      })

    };
    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        position: this[STATE].position,
        data:this[ATTRIBUTE].src[this[STATE].position]
      })
    })
    this.root.addEventListener('start', (event) => {
      tl.pause();
      clearInterval(handler);

      if (Date.now() - t < 500) {
        let progress = (Date.now() - t) / 500;
        ax = 500 - ease(progress) * 500;
      } else {
        ax = 0
      }

    });

    this.root.addEventListener('pan', (event) => {
      let x = ax + (event.clientX - event.startX);

      // ((x- x%500) / 500) = 0或1或2...往右移position是减1,2...
      // 实时得出当前的position偏置，用于判断选中哪个照片做transform
      // pos本身是偏置
      for (const offset of [-1, 0, 1]) {
        let pos = this[STATE].position - ((x - x % 500) / 500) + offset;
        pos = (pos % children.length + children.length) % children.length;

        children[pos].style.transform = `translateX(${-pos * 500 + offset *
          500 + x % 500}px)`;
      }
    });


    this.root.addEventListener('end', (event) => {
      tl.reset();
      tl.start();
      handler = setInterval(nextPicture, 3000);

      let x = ax + (event.clientX - event.startX);//pan过程中移动的距离

      let direction = (function () {
        if (event.flick) {
          return Math.sign(x)//向右：+1。向左：-1
        } else {
          return Math.round((x % 500) / 500);//向右：0或+1。向左：0或-1
        }

      })()

      for (const offset of [-1, 0, 1]) {
        let pos = this[STATE].position - ((x - x % 500) / 500) + offset;
        pos = (pos % children.length + children.length) % children.length;

        tl.add(
          new Animation(
            children[pos].style,
            'transform',
            -pos * 500 + offset * 500 + x % 500,
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            v => `translateX(${v}px)`,
          ),
        );

      }

      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction;

      this[STATE].position = (this[STATE].position % children.length + children.length) %
        children.length;

      this.triggerEvent('change', {
        position: this[STATE].position
      })

    });

    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

}
