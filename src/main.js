import TripPresenter from './presenter/trip-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';

const filtersSection = document.querySelector('.trip-controls__filters');
const eventsSection = document.querySelector('.trip-events');
const buttonSection = document.querySelector('.trip-main');

const tripEventsModel = new TripEventsModel();
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter(eventsSection, tripEventsModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(filtersSection, filterModel, tripEventsModel);

filterPresenter.init();

const newEventButtonComponent = new NewEventButtonView();
const handleNewEventFormClose = () => {
  newEventButtonComponent.element.disabled = false;
};

const handleNewEventButtonClick = () => {
    tripPresenter.createTask(handleNewEventFormClose);
    newEventButtonComponent.element.disabled = true;
  };

render(newEventButtonComponent, buttonSection);
 newEventButtonComponent.setClickListener(handleNewEventButtonClick);
