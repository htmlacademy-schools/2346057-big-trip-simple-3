import TripPresenter from './presenter/trip-presenter.js';
import TripPointsModel from './model/trip-points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const filtersSection = document.querySelector('.trip-controls__filters');
const pointssSection = document.querySelector('.trip-events');
const buttonSection = document.querySelector('.trip-main');

const tripPointsModel = new TripPointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter(pointssSection, tripPointsModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(filtersSection, filterModel, tripPointsModel);

filterPresenter.init();

const newPointButtonComponent = new NewPointButtonView();
const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createTask(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

tripPointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, buttonSection);
    newPointButtonComponent.setClickListener(handleNewPointButtonClick);
  });
