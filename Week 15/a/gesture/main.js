const element = document.documentElement

element.addEventListener('mousedown',(event)=>{
  start(event)
  const mousemove = (event)=>{
    move(event)

  }
  const mouseup = (event)=>{
    end(event)

    element.removeEventListener('mousemove',mousemove)
    element.removeEventListener('mouseup',mouseup)
  }

  element.addEventListener('mousemove',mousemove)
  element.addEventListener('mouseup',mouseup)

})

element.addEventListener('touchstart',({changedTouches})=>{
  for (const touch of changedTouches) {
    start(touch)
  }
})

element.addEventListener('touchmove',({changedTouches})=>{
  for (const touch of changedTouches) {
    move(touch)

  }
})

element.addEventListener('touchend',({changedTouches})=>{
  for (const touch of changedTouches) {
    end(touch)

  }
})

element.addEventListener('touchcancel',({changedTouches})=>{
  for (const touch of changedTouches) {
    cancel(touch)

  }
})



let start = (point)=>{}
let move = (point)=>{
  console.log(
      point.clientX,
      point.clientY,
      );
}
let end = (point)=>{}
let cancel = (point)=>{}










