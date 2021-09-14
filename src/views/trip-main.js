import AbstractView from './abstract.js';

const createTripMainTemplate = () => '<div class="trip-main"></div>';

export default class TripMainView extends AbstractView {
  getTemplate() {
    return createTripMainTemplate();
  }
}
