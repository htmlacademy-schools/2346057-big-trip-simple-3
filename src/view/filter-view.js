import { FILTER_TYPE } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createPointFiltersTemplate = (currentFilter) => `
  <form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilter === FILTER_TYPE.EVERYTHING ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>
    <div class="trip-filters__filter">
    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilter === FILTER_TYPE.FUTURE ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FilterView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createPointFiltersTemplate(this.#currentFilter);
  }

  get selectedFilter() {
    return this.#currentFilter;
  }

  setFilterChangeListener = (callback) => {
    this._callback.chageFilter = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.chageFilter(evt.target.value);
  };
}
