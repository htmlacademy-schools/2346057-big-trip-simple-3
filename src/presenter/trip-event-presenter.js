import { render, replace, remove } from '../framework/render.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripEventView from '../view/trip-event-view.js';
import { USER_ACTION, UPDATE_TYPE } from '../const.js';
import { isDatesEqual } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripEventPresenter {
  #eventComponent = null;
  #eventEditorComponent = null;

  #container = null;
  #changeData = null;
  #changeMode = null;

  #event = null;
  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditorComponent = this.#eventEditorComponent;

    this.#eventComponent = new TripEventView(event);
    this.#eventEditorComponent = new EventEditFormView(event);

    this.#eventComponent.setEditClickListener(this.#replaceEventToForm);


    this.#eventEditorComponent.setFormSubmitListener(this.#handleFormSubmit);
    this.#eventEditorComponent.setCloseButtonClickListener(this.#replaceFormToEvent);
    this.#eventEditorComponent.setDeleteButtonClickListener(this.#handleDeleteClick);

    if (prevEventComponent === null || prevEventEditorComponent === null) {
      render(this.#eventComponent, this.#container.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditorComponent, prevEventEditorComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditorComponent);
  }

  #replaceFormToEvent = () => {
    this.#eventEditorComponent.reset(this.#event);
    replace(this.#eventComponent, this.#eventEditorComponent);
    this.#eventEditorComponent.removeEscKeydownListener();
    this.#mode = Mode.DEFAULT;
  };

  #replaceEventToForm = () => {
    this.#eventEditorComponent.setEscKeydownListener(this.#replaceFormToEvent);
    this.#changeMode();
    this.#mode = Mode.EDITING;

    replace(this.#eventEditorComponent, this.#eventComponent);
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#event.dateTo, update.dateTo) ||
      this.#event.basePrice !== update.basePrice;

    this.#changeData(
      USER_ACTION.UPDATE_TASK,
      isMinorUpdate ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH,
      update,
    );

    this.#replaceFormToEvent();
  };

  destroy = () => {
    remove(this.#eventEditorComponent);
    remove(this.#eventComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditorComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };
  
  #handleDeleteClick = (event) => {
    this.#eventEditorComponent.removeEscKeydownListener();
    this.#changeData(
      USER_ACTION.DELETE_TASK,
      UPDATE_TYPE.MINOR,
      event,
    );
  };
}
