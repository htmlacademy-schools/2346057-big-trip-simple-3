import TripPresenter from './presenter/trip-presenter.js';
import { render } from './render.js';
import EventFiltersView from './view/event-filters-view.js';

const tripFiltersSection = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter();

render(new EventFiltersView(), tripFiltersSection);
tripPresenter.init(tripEventsSection);
