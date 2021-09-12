import { isEsc } from '../utils/common.js';
import { Place, UserAction, UpdateType } from '../const.js';
import { render, rerender, remove } from '../utils/render.js';

import EditPointView from '../views/edit-point.js';

export default class NewPointPresenter {
  constructor({ container, offers, destinations, closeNewPoint, handlePointViewAction }) {
    this._pointContainer = container;
    this._editMode = false;

    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._newPointView = null;

    this._closeNewPoint= closeNewPoint;
    this._handleWindowKeydown = this._handleWindowKeydown.bind(this);
    this._handleReset = this._handleReset.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._changePoint = handlePointViewAction;
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
    console.log('Submit payload', payload);
    await this._changePoint(UserAction.CREATE_POINT, UpdateType.MINOR, payload);
  }
}
