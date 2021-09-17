import AbstractView from './abstract-view.js';

const createTripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsListView extends AbstractView {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
