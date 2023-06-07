import {remove, render, RenderPosition} from '../framework/render.js';
import {nanoid} from 'nanoid';
import {USER_ACTION, UPDATE_TYPE} from '../const.js';
import EventEditFormView from '../view/event-edit-form-view.js';

export default class NewEventPresenter {
  #eventListContainer = null;
  #changeData = null;
  #newEventForm = null;
  #destroyCallback = null;

  constructor(eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#newEventForm !== null) {
      return;
    }

    this.#newEventForm = new EventEditFormView();
    this.#newEventForm.setFormSubmitListener(this.#handleFormSubmit);
    this.#newEventForm.setDeleteButtonClickListener(this.#handleDeleteClick);

    render(this.#newEventForm, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newEventForm === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#newEventForm);
    this.#newEventForm = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (task) => {
    this.#changeData(
      USER_ACTION.ADD_TASK,
      UPDATE_TYPE.MINOR,
      {id: nanoid(), ...task},
    );
    this.destroy();
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
