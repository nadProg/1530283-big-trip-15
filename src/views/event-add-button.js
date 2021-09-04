import AbstractView from './abstract.js';

export const createEventAddButtonTemplate = () => `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`;

export default class EventAddButtonView extends AbstractView {
  getTemplate() {
    return createEventAddButtonTemplate();
  }
}
