import { render } from '../utils/render.js';

import PointsModel from '../models/points.js';

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
    this._offers = [];
    this._destinations = [];

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

    this._tripSceenPresenter = null;
  }

  async init() {
    this._renderHeader();
    this._renderMain();

    const [ points, offers, destinations ] = await Promise.all([
      this._api.getPoints(),
      this._api.getOffers(),
      this._api.getDestinations(),
    ]);

    this._pointsModel.setPoints(null, points);
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
      destinations: this._destinations,
    });

    this._tripSceenPresenter.init();
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
  }
}
