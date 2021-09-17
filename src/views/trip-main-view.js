import AbstractView from './abstract-view.js';

const createTripMainTemplate = () => '<div class="trip-main"></div>';

export default class TripMainView extends AbstractView {
  getTemplate() {
    return createTripMainTemplate();
  }
}
