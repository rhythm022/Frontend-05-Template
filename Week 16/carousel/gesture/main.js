export class Dispatcher {
  constructor(element) {
    this.element = element
  }
  dispatch(type, property) {
    let event = new Event(type)
    for (const propertyKey in property) {
      event[propertyKey] = property[propertyKey]
    }

    this.element.dispatchEvent(event)
  }

}

export class Listener {
  constructor(element, recognizer) {
    let isListeningMoveUp = false
    element.addEventListener('mousedown', (event) => {
      // console.log('mousedown')

      let context = Object.create(null)
      contexts.set('mouse' + (1 << event.button), context)
      recognizer.start(event, context)


      const mousemove = (event) => {
      // console.log('mousemove')

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
            recognizer.move(event, context)
          }
          button = button << 1

        }

      }
      const mouseup = (event) => {
        // console.log('mouseup')

        let context = contexts.get('mouse' + (1 << event.button))
        recognizer.end(event, context)
        contexts.delete('mouse' + (1 << event.button))

        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mousemove)
          document.removeEventListener('mouseup', mouseup)
          isListeningMoveUp = false
        }



      }

      if (!isListeningMoveUp) {
        document.addEventListener('mousemove', mousemove)//因为没必要注册两个move行为函数
        document.addEventListener('mouseup', mouseup)

        isListeningMoveUp = true
      }




    })

    const contexts = new Map()
    element.addEventListener('touchstart', ({ changedTouches }) => {
      // console.log('touchstart')

      for (const touch of changedTouches) {
        const context = Object.create(null)
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context)
      }

    })

    element.addEventListener('touchmove', ({ changedTouches }) => {
      // console.log('touchmove')

      for (const touch of changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.move(touch, context)

      }
    })

    element.addEventListener('touchend', ({ changedTouches }) => {
      // console.log('touchend')

      for (const touch of changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.end(touch, context)
        contexts.delete(touch.identifier)
      }
    })

    element.addEventListener('touchcancel', ({ changedTouches }) => {
      for (const touch of changedTouches) {
        const context = contexts.get(touch.identifier)
        recognizer.cancel(touch, context)
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }

  start(point, context) {
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }]

    context.startX = point.clientX, context.startY = point.clientY

    context.handler = setTimeout(() => {
      context.isTap = false
      context.isPan = false
      context.isPress = true
      context.handler = null
      this.dispatcher.dispatch('press', {});
    }, 500)
  }


  move(point, context) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true
      context.isTap = false
      context.isPress = false
      context.isVertical = Math.abs(dx) < Math.abs(dy)

      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(context.handler)
    }
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    })

  }


  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {})
      clearTimeout(context.handler)
    }

    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {})

    }

    context.points = context.points.filter(point => Date.now() - point.t < 500)

    let v
    if (context.points.length === 0) {
      v = 0
    } else {
      let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 +
        (point.clientY - context.points[0].y) ** 2)

      v = d / (Date.now() - context.points[0].t)
    }

    if (v > 1.5) {
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        flick: context.isFlick,
        velocity: v
      });
      context.isFlick = true
    } else {
      context.isFlick = false

    }

    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        flick: context.isFlick
      });
    }
  }


  cancel(point, context) {
    clearTimeout(context.handler)

    this.dispatcher.dispatch('cancel', {})


  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}



enableGesture(document.documentElement)
document.documentElement.addEventListener('tap', (event) => {
  console.log('tap')
})

document.documentElement.addEventListener('panstart', (event) => {
  console.log('panstart')
})
document.documentElement.addEventListener('pan', (event) => {
  console.log('pan')
})
document.documentElement.addEventListener('panend', (event) => {
  console.log('panend')
})
document.documentElement.addEventListener('press', (event) => {
  console.log('press')
})

document.documentElement.addEventListener('pressend', (event) => {
  console.log('pressend')
})
document.documentElement.addEventListener('flick', (event) => {
  console.log('flick')
})





