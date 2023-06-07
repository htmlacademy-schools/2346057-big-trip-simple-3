import { getDate, getTime } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const createOffersTemplate = (type, offers, availableOffers) => {
  const allOffers = Object.values(availableOffers);
  const template = allOffers
    .filter(({ type: pointType }) => type === pointType)
    .map(({ offers: typeOffers }) =>
      typeOffers
        .filter(({ id }) => offers.includes(id))
        .map(({ title, price }) => `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
      `).join('')
    )
    .join('');

  return template;
};

const createTripPointTemplate = (tripInfo, availableDestinations, availableOffers) => {
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
    ? availableDestinations[destination - 1].name
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
        ${createOffersTemplate(type, offers, availableOffers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

export default class TripPointView extends AbstractView {
  #point = null;
  #availableDestinations = null;
  #availableOffers = null;

  constructor(destinations, offers, point) {
    super();
    this.#availableDestinations = destinations;
    this.#availableOffers = offers;
    this.#point = point;
  }

  get template() {
    return createTripPointTemplate(this.#point, this.#availableDestinations, this.#availableOffers);
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
