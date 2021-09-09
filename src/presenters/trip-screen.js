import { render, rerender } from '../utils/render.js';
import { sortByBasePrice, sortByStartDate, sortByTime } from '../utils/point.js';

import TripEventsView from '../views/trip-events.js';
import SortBarView from '../views/sort-bar.js';
import TripEventsListView from '../views/trip-events-list.js';

import PointPresenter from '../presenters/point.js';
import { SortType } from '../const.js';

export default class TripScreenPresenter {
  constructor({ container, pointsModel, filterModel, offers, destinations }) {
    this._tripScreenContainer = container;

    this._filterModel = filterModel;
    this._pointsModel = pointsModel;
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._sortType = SortType.DAY;

    this._tripEventsView = new TripEventsView();
    this._sortBarView = null;
    this._tripEventsListView = null;

    this._pointPresenters = new Map();

    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);
    this._handleSortBarChange = this._handleSortBarChange.bind(this);
  }

  init() {
    this._sortType = SortType.DAY;

    this._renderTripEventsView();
  }

  destroy() {

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

    const points = [ ...this._pointsModel.getAll()];

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
    this._renderSortBar();
    this._renderPointList();

    render(this._tripScreenContainer, this._tripEventsView);
  }

  _closeAllEditPoints() {
    for (const pointPresenter of this._pointPresenters.values()) {
      pointPresenter.setViewMode();
    }
  }

  _handleSortBarChange(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._renderPointList();
  }
}
