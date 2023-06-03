import { generateTripEvents } from '../mock/trip-event.js';

export default class TripEventsModel {
  #tripEvents = generateTripEvents(5);

  get tripEvents () {
    return this.#tripEvents;
  }
}
