import { render } from '../utils/render.js';

import HeaderView from '../views/header.js';
import HeaderContainerView from '../views/header-container.js';
import TripMainView from '../views/trip-main.js';
import TripInfoView from '../views/trip-info.js';
import TripControlsView from '../views/trip-controls.js';
import NavigationView from '../views/navigation.js';
import FiltersView from '../views/filters.js';
import EventAddButtonView from '../views/event-add-button.js';
import MainView from '../views/main.js';
import ContainerView from '../views/container.js';
import TripEventsView from '../views/trip-events.js';
import SortBarView from '../views/sort-bar.js';
import TripEventsListView from '../views/trip-events-list.js';

import PointPresenter from '../presenters/point.js';

export default class ApplicationPresenter {
  constructor({ container, api }) {
    this._api = api;
    this._applicationContainer = container;

    this._headerView = new HeaderView();
    this._headerContainerView = new HeaderContainerView();
    this._tripMainView = new TripMainView();
    this._tripInfoView = new TripInfoView();
    this._tripControlsView = new TripControlsView();
    this._navigationView = new NavigationView();
    this._filtersView = new FiltersView();
    this._eventAddButtonView = new EventAddButtonView();
    this._mainView = new MainView();
    this._containerView = new ContainerView();
    this._tripEventsView = new TripEventsView();
    this._sortBarView = new SortBarView();
    this._tripEventsListView = new TripEventsListView();

    this._pointPresenters = new Map();

    this._points = [];
    this._offers = [];
    this._destinations = [];

    this._closeAllEditPoints = this._closeAllEditPoints.bind(this);
  }

  async init() {
    this._renderHeader();
    this._renderMain();

    [ this._points,
      this._offers,
      this._destinations,
    ] = await Promise.all([
      this._api.getPoints(),
      this._api.getOffers(),
      this._api.getDestinations(),
    ]);

    this._points.sort(() => Math.random() > 0.5 ? 1 : -1);

    console.log('Points:');
    console.log(this._points);

    console.log('Offers:');
    console.log(this._offers);

    console.log('Destinations:');
    console.log(this._destinations);

    this._renderTripEvents();
  }

  _renderHeader() {
    render(this._applicationContainer, this._headerView);
    render(this._headerView, this._headerContainerView);
    this._renderTripMain();
  }

  _renderTripMain() {
    render(this._headerContainerView, this._tripMainView);
    render(this._tripMainView, this._tripInfoView);
    this._renderTripControls();
    render(this._tripMainView, this._eventAddButtonView);
  }

  _renderTripControls() {
    render(this._tripMainView, this._tripControlsView);
    render(this._tripControlsView, this._navigationView);
    render(this._tripControlsView, this._filtersView);
  }

  _renderMain() {
    render(this._applicationContainer, this._mainView);
    render(this._mainView, this._containerView);
    render(this._containerView, this._tripEventsView);

    render(this._tripEventsView, this._sortBarView);
  }

  _renderTripEvents() {
    render(this._tripEventsView, this._tripEventsListView);

    this._points.forEach((point) => {
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

  _closeAllEditPoints() {
    for (const pointPresenter of this._pointPresenters.values()) {
      pointPresenter.setViewMode();
    }
  }
}
