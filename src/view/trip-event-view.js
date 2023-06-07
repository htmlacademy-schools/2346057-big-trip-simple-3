import { getDate, getTime } from '../utils.js';
import { OFFERS_BY_TYPE } from '../mock/trip-event.js';
import AbstractView from '../framework/view/abstract-view.js';

const createOffersTemplate = (type, offers) => {
  let template = '';
  const allOffers = OFFERS_BY_TYPE[`${type}`].offers;
  Object.values(allOffers).forEach(({id, title, price}) => {
    if (offers.includes(id) || offers.includes(String(id))) {
      template += `
      <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </li>
      `;
    }
  });
  return template;
};

const createTripEventTemplate = (tripInfo) => {
  const {dateFrom, dateTo, offers, type, destination, basePrice} = tripInfo;

  const tripDate = dateFrom !== null
    ? getDate(dateFrom)
    : 'No data';

  const tripTimeFrom = dateFrom !== null
    ? getTime(dateFrom)
    : 'No time';

  const tripTimeTo = dateTo !== null
    ? getTime(dateTo)
    : 'No time';

  const destinationName = destination !== null
    ? destination.name
    : 'No destination';
  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${tripDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${tripTimeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${tripTimeTo}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOffersTemplate(type, offers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

class TripEventView extends AbstractView {
  #info = null;

  constructor(info) {
    super();
    this.#info = info;
  }

  get template() {
    return createTripEventTemplate(this.#info);
  }

  setEditClickListener = (callback) => {
    this._callback.openEditor = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openEditor();
  };

}

export default TripEventView;
