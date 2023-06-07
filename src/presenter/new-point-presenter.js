import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #newPointForm = null;
  #destroyCallback = null;
  #availableDestinations = null;
  #availableOffers = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations = null, offers = null) => {
    this.#availableDestinations = destinations;
    this.#availableOffers = offers;
    this.#destroyCallback = callback;

    if (this.#newPointForm !== null) {
      return;
    }

    this.#newPointForm = PointEditFormView(this.#availableDestinations, this.#availableOffers);
    this.#newPointForm .setFormSubmitListener(this.#handleFormSubmit);
    this.#newPointForm .setDeleteButtonClickListener(this.#handleDeleteClick);

    render(this.#newPointForm, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newPointForm === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#newPointForm );
    this.#newPointForm = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#newPointForm.updateElement({
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newPointForm.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointForm.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
