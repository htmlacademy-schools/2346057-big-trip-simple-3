import AbstractView from '../framework/view/abstract-view.js';

const createEmptyListTemplate = (filter) => {
  if (filter === 'everything') {
    return '<p class="trip-events__msg">Click New Event to create your first point</p>';
  }
  return '<p class="trip-events__msg">There are no future events now</p>';
};

class EmptyListView extends AbstractView {
  #currentFilter;

  constructor(filter) {
    super();
    this.#currentFilter = filter;
  }

  get template() {
    return createEmptyListTemplate(this.#currentFilter);
  }
}

export default EmptyListView;
