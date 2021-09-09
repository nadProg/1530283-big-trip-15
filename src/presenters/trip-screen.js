import { render, rerender } from '../utils/render.js';

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
    this._tripEventsListView = new TripEventsListView();

    this._pointPresenters = new Map();

    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);
    this._handleSortBarClick = this._handleSortBarClick.bind(this);
  }

  init() {
    this._renderTripEventsView();
  }

  destroy() {

  }

  _renderSortBar() {
    const prevSortBarView = this._sortBarView;
    this._sortBarView = new SortBarView(this._sortType);
    this._sortBarView.setClickHandler(this._handleSortBarClick);
    rerender(this._sortBarView, prevSortBarView, this._tripEventsView);
  }

  _renderPointList() {
    render(this._tripEventsView, this._tripEventsListView);

    this._pointsModel.getAll().forEach((point) => {
      const pointPresenter = new PointPresenter({
        offers: this._offers,
        destinations: this._destinations,
        container: this._tripEventsListView,
        closeAllEditPoints: this._closeAllEditPoints,
      });

      this._pointPresenters.set(point.id, pointPresenter);
      pointPresenter.init(point);
    });
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

  _handleSortBarClick(sortType) {
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;

    this._renderSortBar();
  }
}
