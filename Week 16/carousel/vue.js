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

  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextNodeWrapper(child);
    }
    element.appendChild(child);

  }

  return element;
}

export class Component {
  constructor() {

  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    // 大家都wrap了一层，child已经不是dom，所以不能直接this.root.appendChild(child)
    child.mountTo(this.root);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super();
    this.root = document.createElement(type); // ★★★
  }

}

class TextNodeWrapper extends Component {
  constructor(type) {
    super();

    this.root = document.createTextNode(type); // ★★★
  }

}
