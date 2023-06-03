import AbstractView from '../framework/view/abstract-view.js';

const createEmptyListTemplate = () => {
  const filter = document.querySelector('input[name="trip-filter"]:checked').value;
  if (filter === 'everything') {
    return `
    <p class="trip-events__msg">Click New Event to create your first point</p>
    `;
  } else if (filter === 'past') {
    return `
    <p class="trip-events__msg">There are no past events now</p>
    `;
  } else if (filter === 'future') {
    return `
    <p class="trip-events__msg">There are no future events now</p>
    `;
  }
  throw new Error('Unexpected filter');
};

class EmptyListView extends AbstractView {
  #filter;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get filter() {
    return this.#filter;
  }

  set filter(newFilter) {
    this.#filter = newFilter;
    this.removeElement();
  }

  get template() {
    return createEmptyListTemplate();
  }
}

export default EmptyListView;
