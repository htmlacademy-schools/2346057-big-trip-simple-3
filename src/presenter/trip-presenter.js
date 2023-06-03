import { render } from '../render';
import TripEventsListView from '../view/trip-events-list.js';
import EventEditorView from '../view/event-editor-view.js';
import TripEventView from '../view/trip-event-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import { createOnEscKeydownFunction } from '../utils.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #container;
  #tripEventsModel;
  #tripTasks;

  init(container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
    this.#tripTasks = [...this.#tripEventsModel.tripEvents];

    render(new EventListSortingView(), this.#container);
    render(this.#tripEventsList, this.#container);

    for (let i = 0; i < this.#tripTasks.length; i++) {
      this.#renderTask(this.#tripTasks[i]);
    }
  }

  #renderTask = (task) => {
    const taskComponent = new TripEventView(task);
    const taskEditorComponent = new EventEditorView(task);
    let onEditorEscKeydownListener;

    const replaceFormToTask = () => {
      this.#tripEventsList.element.replaceChild(taskComponent.element, taskEditorComponent.element);
      document.removeEventListener('keydown', onEditorEscKeydownListener);
    };

    const replaceTaskToForm = () => {
      this.#tripEventsList.element.replaceChild(taskEditorComponent.element, taskComponent.element);
    };

    const removeTask = () => {
      this.#tripEventsList.element.removeChild(taskEditorComponent.element);
      document.removeEventListener('keydown', onEditorEscKeydownListener);
    };

    taskComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      if (!this.#tripEventsList.isNewFormOrEditorOpen()) {
        replaceTaskToForm();
        onEditorEscKeydownListener = createOnEscKeydownFunction(document, replaceFormToTask);
      }
    });

    taskEditorComponent.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToTask();
    });

    taskEditorComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToTask();
    });

    taskEditorComponent.element.querySelector('.event__reset-btn').addEventListener('click', () => {
      removeTask();
      taskEditorComponent.removeElement();
      taskComponent.removeElement();
    });

    render(taskComponent, this.#tripEventsList.element);
  };
}

export default TripPresenter;
