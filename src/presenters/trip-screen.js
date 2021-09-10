import { remove, rerender } from '../utils/render.js';
import { sortByBasePrice, sortByStartDate, sortByTime, filter } from '../utils/point.js';
import { SortType } from '../const.js';

import TripEventsView from '../views/trip-events.js';
import SortBarView from '../views/sort-bar.js';
import TripEventsListView from '../views/trip-events-list.js';

import PointPresenter from '../presenters/point.js';
import NewPointPresenter from '../presenters/new-point.js';

export default class TripScreenPresenter {
  constructor({ container, pointsModel, filterModel, offers, destinations }) {
    this._tripScreenContainer = container;

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

    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);
    this._handleSortBarChange = this._handleSortBarChange.bind(this);
    this._handleModelChange = this._handleModelChange.bind(this);
  }

  init() {
    this._sortType = SortType.DAY;

    this._renderTripEventsView();

    this._filterModel.addObserver(this._handleModelChange);
  }

  destroy() {
    this._closeAllEditPoints();
    remove(this._tripEventsView);
    this._tripEventsView = null;
    // this._sortBarView = null;
    // this._tripEventsListView = null;
  }

  addNewPoint() {
    if (!this._newPointPresenter) {
      this._newPointPresenter  = new NewPointPresenter({
        container: this._tripEventsListView,
        offers: this._offers,
        destinations: this._destinations,
        closeAllEditPoints: this._closeAllEditPoints,
      });

      this._newPointPresenter.init();
    }
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
      case SortType.DAY:
        points.sort(sortByStartDate);
        break;
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
      });

      this._pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init(point);
    });

    rerender(this._tripEventsListView, prevTripEventsListView, this._tripEventsView);
  }

  _renderTripEventsView() {
    const prevTripEventsView = this._tripEventsView;
    this._tripEventsView = new TripEventsView();

    this._renderSortBar();
    this._renderPointList();

    rerender(this._tripEventsView, prevTripEventsView, this._tripScreenContainer);
  }

  _closeAllEditPoints() {
    for (const pointPresenter of this._pointPresenters.values()) {
      pointPresenter.setViewMode();
    }

    // if (this._newPointPresenter) {
    //   this._newPointPresenter.destroy();
    //   this._newPointPresenter = null;
    // }
  }

  _handleSortBarChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._renderPointList();
  }

  _handleModelChange() {
    this._sortType = SortType.DAY;
    this._renderSortBar();
    this._renderPointList();
  }
}
