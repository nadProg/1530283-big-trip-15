import AbstractView from './abstract.js';

const createTripMainTemplate = () => '<div class="trip-main"><!-- Маршрут и стоимость --></div>';

export default class TripMainView extends AbstractView {
  getTemplate() {
    return createTripMainTemplate();
  }
}
