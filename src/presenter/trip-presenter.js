import { render, RenderPosition, remove } from '../framework/render.js';
import { filter, sortDays, sortPrices } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import PointListSortingView from '../view/point-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
export default class TripPresenter {
  #tripPointsList = new TripPointsListView();
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #pointSorter = null;
  #tripPointPresenter = new Map();
  #container = null;
  #newPointPresenter = null;
  #tripPointsModel = null;
  #filterModel = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #filterType = FilterType.EVERYTHING;
  #sortType = SortType.DAY;

  constructor (container, tripPointsModel, filterModel) {
    this.#container = container;
    this.#tripPointsModel = tripPointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#tripPointsList.element, this.#handleViewAction);

    this.#tripPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#tripPointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#sortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDays);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrices);
    }

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#sortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback, this.#tripPointsModel.destinations, this.#tripPointsModel.offers);
  };

  #renderEmptyList = (isError = false) => {
    this.#emptyListComponent = new EmptyListView(this.#filterType, isError);
    render(this.#emptyListComponent, this.#container);
  };

  #renderPoint = (point) => {
    const destinations = this.#tripPointsModel.destinations;
    const offers = this.#tripPointsModel.offers;
    const tripPointPresenter = new TripPointPresenter(this.#tripPointsList, this.#handleViewAction, this.#handleModeChange, destinations, offers);
    tripPointPresenter.init(point);
    this.#tripPointPresenter.set(point.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripPointsList.element, RenderPosition.AFTERBEGIN);
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();

    remove(this.#pointSorter);
    remove(this.#loadingComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#sortType = SortType.DAY;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.#tripPointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#tripPointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointPresenter.get(update.id).setDeleting();
        try {
          await this.#tripPointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEmptyList(true);
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#pointSorter = new PointListSortingView(this.#sortType);
    this.#pointSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#pointSorter, this.#container, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#clearPointList();
    this.#renderBoard();
  };

  #renderBoard = () => {
    render(this.#tripPointsList, this.#container);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();

    this.#renderPoints();
  };
}
