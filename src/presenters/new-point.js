import { isEsc } from '../utils/common.js';
import { Place } from '../const.js';
import { render, rerender, remove } from '../utils/render.js';

import EditPointView from '../views/edit-point.js';

export default class NewPointPresenter {
  constructor({ container, offers, destinations, closeNewPoint }) {
    this._pointContainer = container;
    this._editMode = false;

    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._newPointView = null;

    this._closeNewPoint= closeNewPoint;
    // this._closeAllEditPoints = closeAllEditPoints;
    // this._handleOpenButtonClick = this._handleOpenButtonClick.bind(this);
    // this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleWindowKeydown = this._handleWindowKeydown.bind(this);
  }

  init() {
    if (this._newPointView) {
      return;
    }

    this._newPointView = new EditPointView(null, this._offers, this._destinations);
    render(this._pointContainer, this._newPointView, Place.AFTER_BEGIN);

    window.addEventListener('keydown', this._handleWindowKeydown);
  }

  destroy() {
    remove(this._newPointView);
    this._newPointView = null;

    this._closeNewPoint();

    window.removeEventListener('keydown', this._handleWindowKeydown);
  }

  _handleWindowKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();

      this.destroy();
    }
  }
}
