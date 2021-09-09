import { isEsc } from '../utils/common.js';
import { render, rerender, remove } from '../utils/render.js';

import PointView from '../views/point.js';
import EditPointView from '../views/edit-point.js';

export default class PointPresenter {
  constructor({ container, offers, destinations, closeAllEditPoints }) {
    this._pointContainer = container;
    this._editMode = false;

    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._currentView = null;

    this._closeAllEditPoints = closeAllEditPoints;
    this._handleOpenButtonClick = this._handleOpenButtonClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleWindowKeydown = this._handleWindowKeydown.bind(this);
  }

  init(point) {
    this._point = point;
    const prevView = this._currentView;

    if (this._editMode) {
      this._currentView = new EditPointView(point, this._offers, this._destinations);
      this._currentView.setRollupButtonClickHandler(this._handleCloseButtonClick);
    } else {
      this._currentView = new PointView(point);
      this._currentView.setRollupButtonClickHandler(this._handleOpenButtonClick);
    }

    rerender(this._currentView, prevView, this._pointContainer);
  }

  destroy() {
    this._point = null;

    remove(this._pointView);
    remove(this._editPointView);

    this._pointView = null;
    this._editPointView = null;
  }

  setEditMode() {
    this._closeAllEditPoints();

    if (!this._editMode) {
      this._editMode = true;
      this.init(this._point);
      window.addEventListener('keydown', this._handleWindowKeydown);
    }
  }

  setViewMode() {
    if (this._editMode) {
      this._editMode = false;
      this.init(this._point);
      window.removeEventListener('keydown', this._handleWindowKeydown);
    }
  }

  _handleOpenButtonClick() {
    this.setEditMode();
  }

  _handleCloseButtonClick() {
    this.setViewMode();
  }

  _handleWindowKeydown(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();

      this.setViewMode();
    }
  }
}
