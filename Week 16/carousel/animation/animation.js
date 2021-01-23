const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('start-time');
const PAUSE_START_TIME = Symbol('pause-start-time');
const PAUSE_TIME = Symbol('pause-time');

export class Timeline {
  constructor() {
    this.state = 'inited'
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }

  start() {
    if(this.state !== 'inited') return
    this.state = 'started'
    let startTime = Date.now();
    this[PAUSE_TIME] = 0

    this[TICK] = () => {

      let now = Date.now()

      for (const animation of this[ANIMATIONS]) {
        // 根据已经经历了多久时间来决定是否请求下一帧
        // t：已历时间
        let t;
        if(this[START_TIME].get(animation) < startTime){
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        }else{
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }
        // animation.duration规定总历时
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        // 每帧执行animations中的一串animation
        if(t > 0){
          animation.receive(t);
        }

      }

      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };

    this[TICK]();
  }

  pause() {
    if(this.state !== 'started') return
    this.state = 'paused'
    this[PAUSE_START_TIME] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if(this.state !== 'paused') return
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START_TIME]

    this[TICK]();
  }

  reset() {
    this.pause()
    this.state = 'inited'
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_START_TIME] = 0//??
    this[TICK_HANDLER] = null
  }

  add(animation,startTime = Date.now()) {
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation,startTime)
  }
}

export class Animation {
  constructor(
      object,
      prop,
      startValue,
      endValue,
      duration = 2000,
      delay = 0,
      timingFunction = (v=>v),
      template = (v=>v)
  ) {
    this.object = object;
    this.prop = prop;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
  }

  receive(time) {// time:已历时间
    // console.log(time);
    let range = this.endValue - this.startValue;
    let progress = this.timingFunction(time / this.duration)
    this.object[this.prop] = this.template(this.startValue + range * progress);
  }
}








































