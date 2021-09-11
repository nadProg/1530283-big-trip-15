import { render, rerender } from '../utils/render.js';
import { FilterType, Place, Screen, UpdateType } from '../const.js';
import { getTripPrice, getTripCities, getTripDate } from '../utils/point.js';

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

import TripScreenPresenter from './trip-screen.js';

export default class ApplicationPresenter {
  constructor({ container, api }) {
    this._api = api;
    this._applicationContainer = container;

    this._pointsModel = new PointsModel();
    this._filterModel = new FilterModel();
    this._offers = [];
    this._destinations = [];

    this._screen = '';

    this._headerView = new HeaderView();
    this._headerContainerView = new HeaderContainerView();
    this._tripMainView = new TripMainView();
    this._tripInfoView = null;
    this._tripControlsView = new TripControlsView();
    this._navigationView = new NavigationView();
    this._filtersView = new FiltersView();
    this._eventAddButtonView = new EventAddButtonView();
    this._mainView = new MainView();
    this._containerView = new ContainerView();

    this._tripSceenPresenter = null;

    this._handleFilterChange = this._handleFilterChange.bind(this);
    this._handleAddEventButtonClick = this._handleAddEventButtonClick.bind(this);
    this._resetAddNewPointMode = this._resetAddNewPointMode.bind(this);

    this._handlePointModelChange = this._handlePointModelChange.bind(this);

    this._pointsModel.addObserver(this._handlePointModelChange);
  }

  async init() {
    this._renderMain();
    this._renderHeader();

    const [ points, offers, destinations ] = await Promise.all([
      this._api.getPoints(),
      this._api.getOffers(),
      this._api.getDestinations(),
    ]);

    this._pointsModel.setPoints(UpdateType.MINOR, points);
    this._offers = [ ...offers ],
    this._destinations = [ ...destinations ];

    console.log('Points:');
    console.log(this._pointsModel.getAll());

    console.log('Offers:');
    console.log(this._offers);

    console.log('Destinations:');
    console.log(this._destinations);

    this._tripSceenPresenter = new TripScreenPresenter({
      offers: this._offers,
      container: this._containerView,
      pointsModel: this._pointsModel,
      filterModel: this._filterModel,
      destinations: this._destinations,
      resetAddNewPointMode: this._resetAddNewPointMode,
    });

    this._renderScreen(Screen.TRIP);
  }

  _renderHeader() {
    render(this._applicationContainer, this._headerView, Place.AFTER_BEGIN);
    render(this._headerView, this._headerContainerView);
    this._renderTripMain();
  }

  _renderTripMain() {
    render(this._headerContainerView, this._tripMainView);
    this._renderTripInfo();
    this._renderTripControls();
    render(this._tripMainView, this._eventAddButtonView);
    this._eventAddButtonView.setClickHandler(this._handleAddEventButtonClick);
  }

  _renderTripControls() {
    this._filtersView.setChangeHandler(this._handleFilterChange);

    render(this._tripMainView, this._tripControlsView);
    render(this._tripControlsView, this._navigationView);
    render(this._tripControlsView, this._filtersView);
  }

  _renderMain() {
    render(this._applicationContainer, this._mainView, Place.AFTER_BEGIN);
    render(this._mainView, this._containerView);
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

  _renderScreen(screen) {
    if (this._screen === screen) {
      return;
    }

    this._screen = screen;

    switch (screen) {
      case Screen.TRIP:
        this._tripSceenPresenter.init();
        break;
      case Screen.STATISCTICS:
        this._tripSceenPresenter.destroy();
        break;
    }
  }

  _handleFilterChange(filter) {
    if (this._filterModel.getFilter() !== filter) {
      this._filterModel.setFilter(UpdateType.MINOR, filter);
    }
  }

  _handleAddEventButtonClick() {
    if (this._screen === Screen.TRIP) {
      console.log('click');
      this._tripSceenPresenter.addNewPoint();
      this._eventAddButtonView.toggleDisabled();
    }
  }

  _resetAddNewPointMode() {
    this._eventAddButtonView.toggleDisabled();
  }

  _handlePointModelChange(updateType) {
    if (updateType === UpdateType.MINOR) {
      this._renderTripInfo();
    }
  }
}
