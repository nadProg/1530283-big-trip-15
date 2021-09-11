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
    this._handleResetButtonClick = this._handleResetButtonClick.bind(this);
    this._handleSubmitButtonClick = this._handleSubmitButtonClick.bind(this);
    this._changePoint = handlePointViewAction;
  }

  init() {
    if (this._newPointView) {
      return;
    }

    this._newPointView = new EditPointView(null, this._offers, this._destinations);
    this._newPointView.setResetButtonClickHandler(this._handleResetButtonClick);
    this._newPointView.setSubmitButtonClickHandler(this._handleSubmitButtonClick);

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

  _handleResetButtonClick() {
    this.destroy();
  }

  _handleSubmitButtonClick(payload) {
    console.log('Submit payload', payload);
    this._changePoint(UserAction.CREATE_POINT, UpdateType.MINOR, payload);
  }
}
