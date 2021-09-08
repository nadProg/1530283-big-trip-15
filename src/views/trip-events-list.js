import AbstractView from './abstract.js';

export const createTripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsView extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
