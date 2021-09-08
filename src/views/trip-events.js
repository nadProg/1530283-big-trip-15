import AbstractView from './abstract.js';

const createTripEventsTemplate = () => `
  <section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>
`;

export default class TripEventsView extends AbstractView {
  getTemplate() {
    return createTripEventsTemplate();
  }
}
