// document.querySelector('#el2').style.transition = 'transform ease-in 2s'
// document.querySelector('#el2').style.transform = 'translateX(500px)'

import {Animation, Timeline} from './animation';
import {ease,easeIn} from './ease';

const timeline = new Timeline();
const animation = new Animation(
    document.querySelector('#el').style,
    'transform',
    0,
    500,
    2000,
    0,
    easeIn,
    v => `translateX(${v}px)`);
timeline.add(animation);

document.querySelector('#pause-btn').addEventListener('click',()=>{
  timeline.pause()
})
document.querySelector('#resume-btn').addEventListener('click',()=>{
  timeline.resume()
})



document.querySelector('#start-btn').addEventListener('click',()=>{
  timeline.start()

})

document.querySelector('#reset-btn').addEventListener('click',()=>{
  timeline.reset()
  timeline.add(animation);

})




