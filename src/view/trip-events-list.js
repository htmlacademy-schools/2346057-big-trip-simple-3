import { createElement, render } from '../render';
import BaseView from './base-view.js';

const createTripEventsListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

const createElementWrapperTemplate = () => `
  <li class="trip-events__item"></li>
`;

class TripEventsListView extends BaseView {
  getTemplate() {
    return createTripEventsListTemplate();
  }

  addEvent(element) {
    const eventItem = createElement(createElementWrapperTemplate());
    render(element, eventItem);
    this.getElement().append(eventItem);
  }
}

export default TripEventsListView;
