import AbstractView from '../framework/view/abstract-view.js';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

class TripEventsListView extends AbstractView {
  get template() {
    return createTripEventsListTemplate();
  }

  isNewFormOrEditorOpen = () => this.element.querySelector('.event--edit');
}

export default TripEventsListView;
