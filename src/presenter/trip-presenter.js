import { render } from '../render';
import TripEventsListView from '../view/trip-events-list.js';
import EventEditorView from '../view/event-editor-view.js';
import TripEventView from '../view/trip-event-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';

class TripPresenter {
  tripEventsList = new TripEventsListView();

  init(container) {
    this.container = container;

    render(new EventListSortingView(), this.container);
    render(this.tripEventsList, this.container);
    this.tripEventsList.addEvent(new EventEditorView());

    for (let i = 0; i < 3; i++) {
      this.tripEventsList.addEvent(new TripEventView());
    }
  }
}

export default TripPresenter;
