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

    this.#newPointForm = new PointEditFormView(this.#availableDestinations, this.#availableOffers);
    this.#newPointForm.setFormSubmitListener(this.#handleFormSubmit);
    this.#newPointForm.setDeleteButtonClickListener(this.#handleDeleteClick);
    this.#newPointForm.setEscKeydownListener(this.#handleDeleteClick);

    render(this.#newPointForm, this.#pointListContainer, RenderPosition.AFTERBEGIN);
  };

  destroy = () => {
    if (this.#newPointForm === null) {
      return;
    }
    this.#newPointForm.removeEscKeydownListener();
    this.#destroyCallback?.();

    remove(this.#newPointForm);
    this.#newPointForm = null;
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
}
