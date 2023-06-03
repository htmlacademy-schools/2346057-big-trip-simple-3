import { render, replace, remove } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventEditFormView from '../view/event-edit-form-view.js';
import TripEventView from '../view/trip-event-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #eventSorter = new EventListSortingView();
  #container;
  #tripEventsModel;
  #tripTasks;

  init(container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;
    this.#tripTasks = [...this.#tripEventsModel.tripEvents];

    render(this.#eventSorter, this.#container);
    render(this.#tripEventsList, this.#container);

    if (this.#tripTasks.length){
      for (let i = 0; i < this.#tripTasks.length; i++) {
        this.#renderTask(this.#tripTasks[i]);
      }
    } else {
      this.#renderEmptyList();
    }
  }

  #renderEmptyList = () => {
    const emptyListComponent = new EmptyListView('Everything');
    render(emptyListComponent, this.#container);
  };

  #renderTask = (task) => {
    const taskComponent = new TripEventView(task);
    let taskEditFormComponent;

    const removeTask = () => {
      taskEditFormComponent.removeAllListeners();
      remove(taskEditFormComponent);
      taskComponent.removeEditClickListener();
      remove(taskComponent);
      const taskIndex = this.#tripTasks.indexOf(task);
      this.#tripTasks.splice(taskIndex, 1);
      if (!this.#tripTasks.length) {
        this.#renderEmptyList();
      }
    };

    const replaceFormToTask = () => {
      taskEditFormComponent.removeAllListeners();
      taskComponent.setEditClickListener(replaceTaskToForm);
      replace(taskComponent, taskEditFormComponent);
      remove(taskEditFormComponent);
    };

    const replaceTaskToForm = () => {
      if (!this.#tripEventsList.isNewFormOrEditorOpen()){
        taskEditFormComponent = new EventEditFormView(task);
        taskEditFormComponent.setFormSubmitListener(replaceFormToTask);
        taskEditFormComponent.setCloseButtonClickListener(replaceFormToTask);
        taskEditFormComponent.setDeleteButtonClickListener(removeTask);
        taskEditFormComponent.setEscKeydownListener(replaceFormToTask);
        replace(taskEditFormComponent, taskComponent);
      }
    };

    taskComponent.setEditClickListener(replaceTaskToForm);

    render(taskComponent, this.#tripEventsList.element);
  };
}

export default TripPresenter;
