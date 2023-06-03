import TripPresenter from './presenter/trip-presenter.js';
import { render } from './framework/render.js';
import EventFiltersView from './view/event-filters-view.js';
import TripEventsModel from './model/trip-events-model.js';

const tripFiltersSection = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripEventsModel = new TripEventsModel();
const tripPresenter = new TripPresenter();

render(new EventFiltersView(), tripFiltersSection);
tripPresenter.init(tripEventsSection, tripEventsModel);
