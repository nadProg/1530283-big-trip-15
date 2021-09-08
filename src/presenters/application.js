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
// Sort
// Content

export default class ApplicationPresenter {
  constructor(applicationContainer) {
    this._applicationContainer = applicationContainer;

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
  }

  init() {
    this._renderHeader();
    this._renderMain();
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
  }
}
