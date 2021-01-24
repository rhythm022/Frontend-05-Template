export function h(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }

  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr]);
  }

  const processChildren = (children) => {
    for (let child of children) {
      if(typeof child === 'object' && child instanceof Array){
        processChildren(child)

        continue
      }
      if (typeof child === 'string') {
        child = new TextNodeWrapper(child);
      }
      element.appendChild(child);

    }
  }


  processChildren(children)

  return element;
}


export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attributes')
export class Component {
  constructor() {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;

  }
  render() {
    return this.root
  }

  appendChild(child) {
    // 大家都wrap了一层，child已经不是dom，所以不能直接this.root.appendChild(child)
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) {
      this.render()
    }
    parent.appendChild(this.root);
  }

  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, c => c.toUpperCase())](new CustomEvent(type, { detail: args }))
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type); // ★★★
  }

  setAttribute(name, value) {
    this.root.setAttribute(name,value)

  }



}

class TextNodeWrapper extends Component {
  constructor(type) {
    super();

    this.root = document.createTextNode(type); // ★★★
  }

}
