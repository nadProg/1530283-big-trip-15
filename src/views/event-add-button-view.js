import AbstractView from './abstract-view.js';

const createEventAddButtonTemplate = () => `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`;

export default class EventAddButtonView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createEventAddButtonTemplate();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  toggleDisabled() {
    this.getElement().disabled = !this.getElement().disabled;
  }

  _clickHandler() {
    this._callback.click();
  }
}
