import AbstractView from './abstract-view.js';

const createTripControlsTemplate = () => '<div class="trip-main__trip-controls  trip-controls"></div>';

export default class TripControlsView extends AbstractView {
  getTemplate() {
    return createTripControlsTemplate();
  }
}
