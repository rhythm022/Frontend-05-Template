const element = document.documentElement
let isListeningMoveUp = false
element.addEventListener('mousedown', (event) => {
  let context = Object.create(null)
  contexts.set('mouse' + (1 << event.button), context)
  start(event, context)


  const mousemove = (event) => {
    let button = 1
    while (button <= event.buttons) {
      if (button & event.buttons) {
        let key
        if (button === 2) {
          key = 4
        }
        else if (button === 4) {
          key = 2
        }
        else {
          key = button
        }
        let context = contexts.get('mouse' + key)
        move(event, context)
      }
      button = button << 1

    }

  }
  const mouseup = (event) => {
    let context = contexts.get('mouse' + (1 << event.button))
    end(event, context)
    contexts.delete('mouse' + (1 << event.button))

    if (event.buttons === 0) {
      element.removeEventListener('mousemove', mousemove)
      element.removeEventListener('mouseup', mouseup)
      isListeningMoveUp = false
    }



  }

  if (!isListeningMoveUp) {
    element.addEventListener('mousemove', mousemove)//因为没必要注册两个move行为函数
    element.addEventListener('mouseup', mouseup)

    isListeningMoveUp = true
  }




})

const contexts = new Map()
element.addEventListener('touchstart', ({ changedTouches }) => {
  for (const touch of changedTouches) {
    const context = Object.create(null)
    contexts.set(touch.identifier, context)
    start(touch, context)
  }

})

element.addEventListener('touchmove', ({ changedTouches }) => {
  for (const touch of changedTouches) {
    const context = contexts.get(touch.identifier)
    move(touch, context)

  }
})

element.addEventListener('touchend', ({ changedTouches }) => {
  for (const touch of changedTouches) {
    const context = contexts.get(touch.identifier)
    end(touch, context)
    contexts.delete(touch.identifier)
  }
})

element.addEventListener('touchcancel', ({ changedTouches }) => {
  for (const touch of changedTouches) {
    const context = contexts.get(touch.identifier)
    cancel(touch, context)
    contexts.delete(touch.identifier)
  }
})


let start = (point, context) => {
  context.isTap = true
  context.isPan = false
  context.isPress = false

  context.startX = point.clientX, context.startY = point.clientY

  context.handler = setTimeout(() => {
    context.isTap = false
    context.isPan = false
    context.isPress = true
    context.handler = null
    console.log('press');
  }, 500)
}


let move = (point, context) => {
  let dx = point.clientX - context.startX, dy = point.clientY - context.startY
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isPan = true
    context.isTap = false
    context.isPress = false
    console.log('panstart')
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('pan')
  }

}


let end = (point, context) => {
  if (context.isTap) {
    console.log('tap')
    clearTimeout(context.handler)
  }
  if (context.isPan) {
    console.log('panend')
  }
  if (context.isPress) {
    console.log('pressend')
  }
}


let cancel = (point, context) => {
  clearTimeout(context.handler)

}












