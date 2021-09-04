import { replace } from '../utils/render.js';

import AbstractView from './abstract.js';

export default class SmartView extends AbstractView {
  constructor() {
    super();

    this._data = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = {
      ...this._data,
      ...update,
    };

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    this.removeElement();
    replace(this.getElement(), prevElement);
    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
