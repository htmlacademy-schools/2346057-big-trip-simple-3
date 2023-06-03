import { render, RenderPosition } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { updateItem } from '../utils.js';
import { sortDays, sortPrices } from '../utils.js';
import { SORT_TYPE } from '../const.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #eventSorter = new EventListSortingView();
  #tripEventPresenter = new Map();
  #container;
  #tripEventsModel;
  #tripEvents = [];

  #currentSortType = SORT_TYPE.DAY;
  constructor (container, tripEventsModel) {

    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
  }
  init() {
    this.#tripEvents = [...this.#tripEventsModel.tripEvents];
    this.#tripEvents.sort(sortDays);
    this.#renderBoard();
  }

  #renderEventList = () => {
    render(this.#tripEventsList, this.#container);
    this.#renderEvents();
  };


  #renderEmptyList = () => {
    const emptyListComponent = new EmptyListView('Everything');
    render(emptyListComponent, this.#container);
  };

  #renderEvent = (task) => {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList, this.#handleEventChange, this.#handleModeChange);
    tripEventPresenter.init(task);
    this.#tripEventPresenter.set(task.id, tripEventPresenter);
  };

  #renderEvents = () => {
    this.#tripEvents.forEach((task) => this.#renderEvent(task));
  };

  #handleEventChange = (updatedEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);
    this.#tripEventPresenter.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    render(this.#eventSorter, this.#container, RenderPosition.AFTERBEGIN);
    this.#eventSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEventList();
    this.#renderEventList();
  };

  #sortEvents = (sortType) => {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this.#tripEvents.sort(sortDays);
        break;
      case SORT_TYPE.PRICE:
        this.#tripEvents.sort(sortPrices);
        break;
    }

    this.#currentSortType = sortType;
  };

  #renderBoard = () => {
    if (this.#tripEvents.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEventList();
  };
}

export default TripPresenter;
