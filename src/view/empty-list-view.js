import BaseView from './base-view.js';

const createEmptyListTemplate = (filter) => {
  if (filter === 'Everything') {
    return `
    <p class="trip-events__msg">Click New Event to create your first point</p>
    `;
  } else if (filter === 'Past') {
    return `
    <p class="trip-events__msg">There are no past events now</p>
    `;
  } else if (filter === 'Future') {
    return `
    <p class="trip-events__msg">There are no future events now</p>
    `;
  }
  throw new Error('Unexpected filter');
};

class EmptyListView extends BaseView {
  #filter;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#filter);
  }
}

export default EmptyListView;
