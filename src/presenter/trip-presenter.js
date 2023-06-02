import { render } from '../render';
import TripEventsListView from '../view/trip-events-list.js';
import EventEditorView from '../view/event-editor-view.js';
import TripEventView from '../view/trip-event-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';

class TripPresenter {
  tripEventsList = new TripEventsListView();

  init(container, tripEventsModel) {
    this.container = container;
    this.tripEventsModel = tripEventsModel;
    this.tripTasks = [...this.tripEventsModel.getTripEvents()];

    render(new EventListSortingView(), this.container);
    render(this.tripEventsList, this.container);
    this.tripEventsList.addEvent(new EventEditorView(this.tripTasks[0]));

    for (let i = 1; i < this.tripTasks.length; i++) {
      this.tripEventsList.addEvent(new TripEventView(this.tripTasks[i]));
    }
  }
}

export default TripPresenter;
