import AbstractView from '../framework/view/abstract-view.js';

const createEmptyListTemplate = (filter, isError) => {
  if (!isError) {
    if (filter === 'everything') {
      return '<p class="trip-events__msg">Click New Event to create your first point</p>';
    }
    return '<p class="trip-events__msg">There are no future events now</p>';
  }
  return '<p class="trip-events__msg">Something went wrong. Please try again later</p>';
};

class EmptyListView extends AbstractView {
  #currentFilter = null;
  #isError = null;

  constructor(filter, isError) {
    super();
    this.#currentFilter = filter;
    this.#isError = isError;
  }

  get template() {
    return createEmptyListTemplate(this.#currentFilter, this.#isError);
  }
}

export default EmptyListView;
