import { isEsc, isOnline } from '../utils/common.js';
import { Place, UserAction, UpdateType, Message } from '../const.js';
import { render, remove } from '../utils/render.js';
import { alert } from '../utils/alert.js';

import EditPointView from '../views/edit-point.js';

export default class NewPointPresenter {
  constructor({ container, offers, destinations, closeNewPoint, handlePointViewAction, api }) {
    this._api = api;
    this._pointContainer = container;
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];
    this._closeNewPoint= closeNewPoint;
    this._changePoint = handlePointViewAction;

    this._editMode = false;
    this._newPointView = null;

    this._handleReset = this._handleReset.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleWindowKeydown = this._handleWindowKeydown.bind(this);
  }

  init() {
    if (this._newPointView) {
      return;
    }

    this._newPointView = new EditPointView(null, this._offers, this._destinations);
    this._newPointView.setResetHandler(this._handleReset);
    this._newPointView.setSubmitHandler(this._handleSubmit);

    render(this._pointContainer, this._newPointView, Place.AFTER_BEGIN);

    window.addEventListener('keydown', this._handleWindowKeydown);
  }

  destroy() {
    this._newPointView.destroyDatePickers();
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

  _handleReset() {
    this.destroy();
  }

  async _handleSubmit(payload) {
    if (!isOnline()) {
      alert(Message.CREATE_IN_OFLLINE);
      throw new Error(Message.OFFLINE);
    }

    const updatedPayload = await this._api.createPoint(payload);
    await this._changePoint(UserAction.CREATE_POINT, UpdateType.MINOR, updatedPayload);
  }
}
