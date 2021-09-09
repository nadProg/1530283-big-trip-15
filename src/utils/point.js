import { render, rerender, remove } from './render.js';

import PointView from '../views/point.js';
import EditPointView from '../views/edit-point.js';

export default class PointPresenter {
  constructor({ container, offers, destinations }) {
    this._pointContainer = container;
    this._editMode = false;

    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._currentView = null;

    this._handleRollupButtonClick = this._handleRollupButtonClick.bind(this);
  }

  init(point) {
    this._point = point;
    const prevView = this._currentView;

    if (this._editMode) {
      this._currentView = new EditPointView(point, this._offers, this._destinations);
    } else {
      this._currentView = new PointView(point);
      this._currentView.setRollupButtonClickHandler(this._handleRollupButtonClick);
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

  _handleRollupButtonClick() {
    console.log('Click');
    this._editMode = true;
    this.init(this._point);
  }
}
