import { Component, STATE, ATTRIBUTE } from './vue';
import { enableGesture } from './gesture/main';
export { STATE, ATTRIBUTE } from './vue'
import { h } from './vue';


export class Button extends Component {
  constructor() {
    super();
  }

  render(){
    this.childContainer = <span/>
    this.root = (<div>{this.childContainer}</div>).render()

    return this.root
  }

  appendChild(child){
    if(!this.childContainer){
      this.render()
    }
    this.childContainer.appendChild(child)
  }

}
