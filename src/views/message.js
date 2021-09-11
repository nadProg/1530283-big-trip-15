import AbstractView from './abstract.js';

const createMessageTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class MessageView extends AbstractView {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createMessageTemplate(this._message);
  }
}

