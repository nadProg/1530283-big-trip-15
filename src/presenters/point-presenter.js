import { UserAction, UpdateType, Message } from '../const.js';
import { isEsc, isOnline } from '../utils/common.js';
import { rerender } from '../utils/render.js';
import { alert } from '../utils/alert.js';

import PointView from '../views/point-view.js';
import EditPointView from '../views/edit-point-view.js';

export default class PointPresenter {
  constructor({ container, offers, destinations, closeAllEditPoints, handlePointViewAction, api }) {
    this._api = api;
    this._pointContainer = container;
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];
    this._changePoint = handlePointViewAction;
    this._closeAllEditPoints = closeAllEditPoints;

    this._point = null;
    this._editMode = false;
    this._currentView = null;

    this._handleReset = this._handleReset.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleOpenButtonClick = this._handleOpenButtonClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);

    this._windowKeydownHandler = this._windowKeydownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    const prevView = this._currentView;

    if (this._editMode) {
      this._currentView = new EditPointView(point, this._offers, this._destinations);
      this._currentView.setResetHandler(this._handleReset);
      this._currentView.setSubmitHandler(this._handleSubmit);
      this._currentView.setCloseButtonClickHandler(this._handleCloseButtonClick);
    } else {
      this._currentView = new PointView(point);
      this._currentView.setOpenButtonClickHandler(this._handleOpenButtonClick);
      this._currentView.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    }

    if (prevView instanceof EditPointView) {
      prevView.destroyDatePickers();
    }

    rerender(this._currentView, prevView, this._pointContainer);
  }

  setOffersAndDestinations(offers = [], destinations = []) {
    this._offers = offers;
    this._destinations = destinations;
  }

  setEditMode() {
    this._closeAllEditPoints();

    if (!this._editMode) {
      this._editMode = true;
      this.init(this._point);
      window.addEventListener('keydown', this._windowKeydownHandler);
    }
  }

  setViewMode() {
    if (this._editMode) {
      this._editMode = false;
      this.init(this._point);
      window.removeEventListener('keydown', this._windowKeydownHandler);
    }
  }

  _handleOpenButtonClick() {
    if (!isOnline()) {
      alert(Message.EDIT_IN_OFFLINE);
      return;
    }

    if (!this._offers.length || !this._destinations.length) {
      alert(Message.NO_DATA_TO_EDIT);
      return;
    }

    this.setEditMode();
  }

  _handleCloseButtonClick() {
    this.setViewMode();
  }

  async _handleFavoriteButtonClick() {
    const updatedPoint = {
      ...this._point,
      isFavorite: !this._point.isFavorite,
    };

    const updatedPayload = await this._api.updatePoint(updatedPoint);
    this._changePoint(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPayload);
  }

  async _handleSubmit(payload) {
    if (!isOnline()) {
      alert(Message.EDIT_IN_OFFLINE);
      throw new Error(Message.OFFLINE);
    }

    const updatedPayload = await this._api.updatePoint(payload);
    await this._changePoint(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPayload);
  }

  async _handleReset(payload) {
    if (!isOnline()) {
      alert(Message.DELETE_IN_OFFLINE);
      throw new Error(Message.OFFLINE);
    }

    await this._api.deletePoint(payload);
    await this._changePoint(UserAction.DELETE_POINT, UpdateType.MINOR, payload);
  }

  _windowKeydownHandler(evt) {
    if (isEsc(evt)) {
      evt.preventDefault();

      this.setViewMode();
    }
  }
}
