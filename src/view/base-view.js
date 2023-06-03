import {createElement} from '../render.js';

class BaseView {
  _element = null;
  get template() {
    throw new Error('There is no template');
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default BaseView;
