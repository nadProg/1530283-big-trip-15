import { remove, rerender, render } from '../utils/render.js';
import { sortByBasePrice, sortByTime, filterPoints } from '../utils/point.js';
import { SortType, UpdateType, UserAction, filterTypeToMessage, Message } from '../const.js';
import { alert } from '../utils/alert.js';

import TripEventsView from '../views/trip-events.js';
import SortBarView from '../views/sort-bar.js';
import TripEventsListView from '../views/trip-events-list.js';
import MessageView from '../views/message.js';

import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';

export default class TableScreenPresenter {
  constructor({ container, pointsModel, filterModel, offers = [], destinations = [], resetAddNewPointMode, api }) {
    this._api = api;
    this._tableScreenContainer = container;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];
    this._resetAddNewPointMode = resetAddNewPointMode;

    this._sortType = SortType.DAY;

    this._messageView = null;
    this._sortBarView = null;
    this._tripEventsView = null;
    this._tripEventsListView = null;

    this._pointPresenters = new Map();
    this._newPointPresenter = null;

    this._closeNewPoint = this._closeNewPoint.bind(this);
    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);

    this._handleModelChange = this._handleModelChange.bind(this);
    this._handleSortBarChange = this._handleSortBarChange.bind(this);
    this._handlePointViewAction = this._handlePointViewAction.bind(this);
  }

  get addNewPointMode() {
    return !!this._newPointPresenter;
  }

  init() {
    this._sortType = SortType.DAY;

    this._renderTripEventsView();

    this._filterModel.addObserver(this._handleModelChange);
    this._pointsModel.addObserver(this._handleModelChange);
  }

  destroy() {
    this._closeAllEditPoints();

    remove(this._tripEventsView);
    this._tripEventsView = null;

    this._filterModel.removeObserver(this._handleModelChange);
    this._pointsModel.removeObserver(this._handleModelChange);
  }

  setOffersAndDestinations(offers = [], destinations = []) {
    this._offers = offers;
    this._destinations = destinations;

    this._pointPresenters.forEach((presenter) => {
      presenter.setOffersAndDestinations(offers, destinations);
    });
  }

  addNewPoint() {
    if (!this._offers.length || !this._destinations.length) {
      alert(Message.NO_DATA_TO_CREATE);
      this._resetAddNewPointMode();
      return;
    }

    this._closeAllEditPoints();

    if (!this._pointPresenters.size) {
      this._removeMessage();
      this._tripEventsListView = new TripEventsListView();
      render(this._tripEventsView, this._tripEventsListView);
    }

    this._newPointPresenter  = new NewPointPresenter({
      api: this._api,
      container: this._tripEventsListView,
      offers: this._offers,
      destinations: this._destinations,
      closeAllEditPoints: this._closeAllEditPoints,
      closeNewPoint: this._closeNewPoint,
      handlePointViewAction: this._handlePointViewAction,
    });

    this._newPointPresenter.init();
  }

  _renderSortBar() {
    this._sortBarView = new SortBarView(this._sortType);
    this._sortBarView.setChangeHandler(this._handleSortBarChange);
    render(this._tripEventsView, this._sortBarView);
  }

  _renderPointList(points) {
    this._tripEventsListView = new TripEventsListView();

    this._pointPresenters.clear();

    switch (this._sortType) {
      case SortType.TIME:
        points.sort(sortByTime);
        break;
      case SortType.PRICE:
        points.sort(sortByBasePrice);
        break;
    }

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        api: this._api,
        offers: this._offers,
        destinations: this._destinations,
        container: this._tripEventsListView,
        closeAllEditPoints: this._closeAllEditPoints,
        handlePointViewAction: this._handlePointViewAction,
      });

      this._pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init(point);
    });

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }

    render(this._tripEventsView, this._tripEventsListView);
  }

  _renderTripEventsView() {
    const prevTripEventsView = this._tripEventsView;

    if (this._messageView) {
      this._removeMessage();
    }

    this._tripEventsView = new TripEventsView();

    const points = filterPoints[this._filterModel.getFilter()](this._pointsModel.getAll());

    if (points.length) {
      this._renderSortBar();
      this._renderPointList(points);
    } else {
      this._pointPresenters.clear();
      this._renderMessage();
    }

    rerender(this._tripEventsView, prevTripEventsView, this._tableScreenContainer);
  }

  _renderMessage() {
    const message = filterTypeToMessage[this._filterModel.getFilter()];
    this._messageView = new MessageView(message);
    render(this._tripEventsView, this._messageView);
  }

  _removeMessage() {
    remove(this._messageView);
    this._messageView = null;
  }

  _handleSortBarChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._renderTripEventsView();
  }

  async _handlePointViewAction(userAction, updateType, payload) {
    switch (userAction) {
      case UserAction.CREATE_POINT:
        this._pointsModel.createPoint(updateType, payload);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, payload);
        break;

      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, payload);
        break;
    }
  }

  _handleModelChange(updateType, payload) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._pointPresenters.has(payload.id)) {
          this._pointPresenters.get(payload.id).init(payload);
        }
        break;

      case UpdateType.MINOR:
        this._renderTripEventsView();
        break;

      case UpdateType.MAJOR:
        this._sortType = SortType.DAY;
        this._renderTripEventsView();
        break;
    }
  }

  _closeNewPoint() {
    this._newPointPresenter = null;
    this._resetAddNewPointMode();

    if (!this._pointPresenters.size) {
      this._renderMessage();
    }
  }

  _closeAllEditPoints() {
    for (const pointPresenter of this._pointPresenters.values()) {
      pointPresenter.setViewMode();
    }

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }
  }
}
