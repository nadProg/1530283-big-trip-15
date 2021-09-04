import AbstractView from './abstract.js';

export const createTripEventsTemplate = () => `
  <section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
    <!-- Сортировка -->

    <!-- Контент -->
  </section>
`;

export default class TripEventsView extends AbstractView {
  getTemplate() {
    return createTripEventsTemplate();
  }
}
