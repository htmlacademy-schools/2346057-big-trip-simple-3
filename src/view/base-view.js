import {createElement} from '../render.js';

class BaseView {
  getTemplate() {
    throw new Error('There is no template');
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default BaseView;
