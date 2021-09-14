import { Place, Screen, UpdateType, Message, FilterType } from '../const.js';
import { render, rerender, remove } from '../utils/render.js';
import { isOnline } from '../utils/common.js';
import { getTripPrice, getTripCities, getTripDate, getFilters } from '../utils/point.js';
import { getStatisticsDatasets } from '../utils/statistics.js';
import { alert } from '../utils/alert.js';

import PointsModel from '../models/points.js';
import FilterModel from '../models/filter.js';

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
import StatisticsView from '../views/statistics.js';
import TripEventsView from '../views/trip-events.js';
import MessageView from '../views/message.js';

import TableScreenPresenter from './table-screen.js';

export default class ApplicationPresenter {
  constructor({ container, api }) {
    this._api = api;
    this._applicationContainer = container;

    this._pointsModel = new PointsModel();
    this._filterModel = new FilterModel();

    this._screen = Screen.TABLE;
    this._isLoading = true;

    this._headerView = new HeaderView();
    this._headerContainerView = new HeaderContainerView();
    this._tripMainView = new TripMainView();
    this._tripInfoView = null;
    this._tripControlsView = new TripControlsView();
    this._navigationView = null;
    this._filtersView = null;
    this._eventAddButtonView = new EventAddButtonView();
    this._mainView = new MainView();
    this._containerView = new ContainerView();
    this._statisticsView = null;
    this._loadingScreenView = null;

    this._tableSceenPresenter = null;

    this._resetAddNewPointMode = this._resetAddNewPointMode.bind(this);

    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleNavigationClick = this._handleNavigationClick.bind(this);
    this._handlePointModelChange = this._handlePointModelChange.bind(this);
    this._handleAddEventButtonClick = this._handleAddEventButtonClick.bind(this);
    this._loadOffersAndDestinations = this._loadOffersAndDestinations.bind(this);

    this._pointsModel.addObserver(this._handlePointModelChange);
  }

  async init() {
    this._renderMain();
    this._renderHeader();
    this._renderLoadingScreen();
    this._eventAddButtonView.toggleDisabled();

    try {
      const points = await this._api.getPoints();
      this._pointsModel.setPoints(UpdateType.INIT, points.slice(0, 1));
    } catch (error) {
      alert(error.message);
    }

    this._isLoading = false;
    this._screen = Screen.TABLE;
    this._eventAddButtonView.toggleDisabled();

    this._tableSceenPresenter = new TableScreenPresenter({
      api: this._api,
      offers: this._offers,
      container: this._containerView,
      pointsModel: this._pointsModel,
      filterModel: this._filterModel,
      destinations: this._destinations,
      resetAddNewPointMode: this._resetAddNewPointMode,
    });

    this._removeLoadingScreen();
    this._renderNavigation();
    this._renderScreen();

    window.addEventListener('online', this._loadOffersAndDestinations);

    if (isOnline()) {
      this._loadOffersAndDestinations();
    }
  }

  _renderHeader() {
    render(this._applicationContainer, this._headerView, Place.AFTER_BEGIN);
    render(this._headerView, this._headerContainerView);
    this._renderTripMain();
  }

  _renderMain() {
    render(this._applicationContainer, this._mainView, Place.AFTER_BEGIN);
    render(this._mainView, this._containerView);
  }

  _renderTripMain() {
    render(this._headerContainerView, this._tripMainView);
    this._renderTripInfo();
    this._renderTripControls();

    this._eventAddButtonView.setClickHandler(this._handleAddEventButtonClick);
    render(this._tripMainView, this._eventAddButtonView);
  }

  _renderLoadingScreen() {
    this._loadingScreenView = new TripEventsView();
    render(this._loadingScreenView, new MessageView(Message.LOADING));
    render(this._containerView, this._loadingScreenView);
  }

  _removeLoadingScreen() {
    remove(this._loadingScreenView);
    this._loadingScreenView = null;
  }

  _renderTripInfo() {
    const prevTripInfoView = this._tripInfoView;
    const points = this._pointsModel.getAll();
    this._tripInfoView = new TripInfoView({
      tripDate: getTripDate(points),
      tripCities: getTripCities(points),
      price: getTripPrice(points),
    });
    rerender(this._tripInfoView, prevTripInfoView, this._tripMainView);
  }

  _renderTripControls() {
    this._renderNavigation();
    this._renderFilters();
    render(this._tripMainView, this._tripControlsView);
  }

  _renderNavigation() {
    const prevNavigationView = this._navigationView;
    this._navigationView = new NavigationView(this._screen);
    this._navigationView.setClickHandler(this._handleNavigationClick);
    rerender(this._navigationView, prevNavigationView, this._tripControlsView);
  }

  _renderFilters() {
    const prevFiltersView = this._filtersView;

    const currentActiveFilter = this._filterModel.getFilter();
    const currentFilters = getFilters(this._pointsModel.getAll());
    this._filtersView = new FiltersView(currentActiveFilter, currentFilters);
    this._filtersView.setChangeHandler(this._handleFilterChange);

    rerender(this._filtersView, prevFiltersView, this._tripControlsView);
  }

  _renderScreen() {
    if (this._isLoading) {
      return;
    }

    switch (this._screen) {
      case Screen.TABLE:
        this._removeStatistics();
        this._tableSceenPresenter.init();
        break;

      case Screen.STATISCTICS:
        this._tableSceenPresenter.destroy();
        this._renderStatistics();
        break;
    }
  }

  _renderStatistics() {
    const statistics = getStatisticsDatasets(this._pointsModel.getAll());
    this._statisticsView = new StatisticsView(statistics);
    render(this._containerView, this._statisticsView);
  }

  _removeStatistics() {
    if (this._statisticsView) {
      remove(this._statisticsView);
      this._statisticsView = null;
    }
  }

  _handleNavigationClick(screen) {
    if (this._screen === screen) {
      return;
    }

    this._screen = screen;

    this._renderNavigation();
    this._renderScreen();
  }

  _handleFilterChange(filter) {
    if (this._filterModel.getFilter() !== filter) {
      this._filterModel.setFilter(UpdateType.MAJOR, filter);
    }
  }

  _handleAddEventButtonClick() {
    if (!isOnline()) {
      alert(Message.CREATE_IN_OFLLINE);
      return;
    }

    if (this._isLoading) {
      return;
    }

    if (this._screen === Screen.TABLE) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      this._renderFilters();
      this._tableSceenPresenter.addNewPoint();
      this._eventAddButtonView.toggleDisabled();
    }
  }

  _handlePointModelChange(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.MINOR:
        this._renderFilters();
        this._renderTripInfo();
        break;

      case UpdateType.MAJOR:
        this._renderFilters();
        break;
    }
  }

  _resetAddNewPointMode() {
    this._eventAddButtonView.toggleDisabled();
  }

  async _loadOffersAndDestinations() {
    try {
      const [ offers, destinations ] = await Promise.all([
        this._api.getOffers(),
        this._api.getDestinations(),
      ]);

      this._tableSceenPresenter.setOffersAndDestinations(offers, destinations);
    } catch (error) {
      alert(error.message);
    }
  }
}
