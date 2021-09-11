import { remove, rerender } from '../utils/render.js';
import { sortByBasePrice, sortByStartDate, sortByTime, filter } from '../utils/point.js';
import { SortType, UpdateType, UserAction } from '../const.js';

import TripEventsView from '../views/trip-events.js';
import SortBarView from '../views/sort-bar.js';
import TripEventsListView from '../views/trip-events-list.js';

import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';

export default class TableScreenPresenter {
  constructor({ container, pointsModel, filterModel, offers, destinations, resetAddNewPointMode }) {
    this._tableScreenContainer = container;

    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._sortType = SortType.DAY;

    this._tripEventsView = null;
    this._sortBarView = null;
    this._tripEventsListView = null;

    this._pointPresenters = new Map();
    this._newPointPresenter = null;

    this._resetAddNewPointMode = resetAddNewPointMode;

    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);
    this._handleSortBarChange = this._handleSortBarChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);

    this._handlePointViewAction = this._handlePointViewAction.bind(this);

    this._closeNewPoint = this._closeNewPoint.bind(this);
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
    this._sortBarView = null;
    this._tripEventsListView = null;

    this._filterModel.removeObserver(this._handleModelChange);
    this._pointsModel.removeObserver(this._handleModelChange);
  }

  addNewPoint() {
    this._closeAllEditPoints();

    this._newPointPresenter  = new NewPointPresenter({
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
    const prevSortBarView = this._sortBarView;
    this._sortBarView = new SortBarView(this._sortType);
    this._sortBarView.setChangeHandler(this._handleSortBarChange);
    rerender(this._sortBarView, prevSortBarView, this._tripEventsView);
  }

  _renderPointList() {
    const prevTripEventsListView = this._tripEventsListView;
    this._tripEventsListView = new TripEventsListView();

    const points = filter[this._filterModel.getFilter()](this._pointsModel.getAll());

    switch (this._sortType) {
      case SortType.TIME:
        points.sort(sortByTime);
        break;
      case SortType.PRICE:
        points.sort(sortByBasePrice);
        break;
    }

    this._pointPresenters.clear();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
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

    rerender(this._tripEventsListView, prevTripEventsListView, this._tripEventsView);
  }

  _renderTripEventsView() {
    const prevTripEventsView = this._tripEventsView;
    this._tripEventsView = new TripEventsView();

    this._renderSortBar();
    this._renderPointList();

    rerender(this._tripEventsView, prevTripEventsView, this._tableScreenContainer);
  }

  _closeAllEditPoints() {
    for (const pointPresenter of this._pointPresenters.values()) {
      pointPresenter.setViewMode();
    }

    if (this._newPointPresenter) {
      this._newPointPresenter.destroy();
    }
  }

  _handleSortBarChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._renderPointList();
  }

  _handlePointViewAction(userAction, updateType, payload) {
    switch (userAction) {
      case UserAction.CREATE_POINT:
        this._pointsModel.createPoint(updateType, payload);
        break;

      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, payload);
        break;

      case UserAction.UPDATE_POINT:
        console.log('update!');
        this._pointsModel.updatePoint(updateType, payload);
        break;
    }

  }

  _handleModelChange(updateType, payload) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._pointPresenters.has(payload.id)) {
          console.log('!');
          this._pointPresenters.get(payload.id).init(payload);
        }
        break;

      case UpdateType.MINOR:
        this._renderSortBar();
        this._renderPointList();
        break;

      case UpdateType.MAJOR:
        this._sortType = SortType.DAY;
        this._renderSortBar();
        this._renderPointList();
        break;
    }
  }

  _closeNewPoint() {
    this._newPointPresenter = null;
    this._resetAddNewPointMode();
  }
}
