import BaseView from './base-view.js';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

class TripEventsListView extends BaseView {
  get template() {
    return createTripEventsListTemplate();
  }

  isNewFormOrEditorOpen = () => this.element.querySelector('.event--edit');
}

export default TripEventsListView;
