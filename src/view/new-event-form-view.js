import { getFullDataTime } from '../utils.js';
import { OFFERS_BY_TYPE, DESTINATION_NAMES } from '../mock/trip-event.js';
import AbstractView from '../framework/view/abstract-view.js';

const INFO_TEMPLATE = {
  id: 1,
  type: 'flight',
  dateFrom: '2023-01-10T22:55:56.845Z',
  dateTo: '2023-01-10T22:55:56.845Z',
  basePrice: 0,
  offers: null,
  destination: null,
};

const createDestinationTemplate = (destination) => {
  const {description, pictures} = destination;

  let picturesSection = '';
  pictures.forEach(({src, description: photoDescription}) => {
    picturesSection += `<img class="event__photo" src="${src}" alt="${photoDescription}">`;
  });

  return `
    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesSection}
          </div>
        </div>
      </section>
  `;
};

const createDestinationListTemplate = () => {
  let template = '';
  DESTINATION_NAMES.forEach((name) => {
    template += `<option value="${name}"></option>`;
  });
  return template;
};

const createOffersTemplate = (type, offers) => {
  let template = '';
  const allOffers = OFFERS_BY_TYPE[`${type}`].offers;
  Object.values(allOffers).forEach(({id, title, price}) => {
    if (offers.includes(id)) {
      template += `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${title}" checked>
              <label class="event__offer-label" for="${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>
    `;
    } else {
      template += `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${title}">
              <label class="event__offer-label" for="${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>
    `;
    }
  });
  return (template) ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${template}
    </div>
  </section>
    ` : '';
};

const createTypeImageTemplate = (currentType) => {
  let template = '';
  const allTypes = Object.keys(OFFERS_BY_TYPE);
  allTypes.forEach((type) => {
    const checkedValue = (type === currentType) ? 'checked' : '';
    template += `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checkedValue}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
    `;
  });
  return template;
};

const createNewEventFormTemplate = (tripInfo) => {
  const {dateFrom, dateTo, offers, type, destination, basePrice} = tripInfo;

  const tripDateFrom = dateFrom !== null
    ? getFullDataTime(dateFrom)
    : 'No data';

  const tripDateTo = dateTo !== null
    ? getFullDataTime(dateTo)
    : 'No data';

  const destinationName = destination !== null
    ? destination.name
    : 'No destination';

  return `
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypeImageTemplate(type)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationListTemplate()}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${tripDateFrom}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${tripDateTo}"">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro; ${basePrice}
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${createOffersTemplate(type, offers)}
      ${createDestinationTemplate(destination)}
    </section>
  </form>
</li>
`;
};

class NewEventFormView extends AbstractView {
  #info = null;

  constructor(info = INFO_TEMPLATE) {
    super();
    this.#info = info;
  }

  get template() {
    return createNewEventFormTemplate(this.#info);
  }

  setCloseClickListener = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeForm();
  };

  setFormSubmitListener = (callback) => {
    this._callback.saveForm = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSaveHandler);
  };

  #formSaveHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveForm();
  };

  setEscKeydownListener = (callback) => {
    this._callback.escClose = callback;
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #escKeydownHandler = (evt) => {
    evt.preventDefault();
    this._callback.escClose();
  };

  removeEscKeydownListener = () => {
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  removeFormSubmitListener = () => {
    this.element.querySelector('form').removeEventListener('submit', this.#formSaveHandler);
  };

  removeCloseClickListener = () => {
    this.element.querySelector('.event__reset-btn').removeEventListener('click', this.#closeClickHandler);
  };

  removeAllListeners = () => {
    this.removeEscKeydownListener();
    this.removeFormSubmitListener();
    this.removeCloseClickListener();
  };
}

export default NewEventFormView;
