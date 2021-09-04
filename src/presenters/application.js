import { render } from '../utils/render.js';

import HeaderView from '../views/header.js';
import HeaderContainerView from '../views/header-container.js';
import TripMainView from '../views/trip-main.js';
import TripControlsView from '../views/trip-controls.js';
import NavigationContainerView from '../views/navigation-container.js';
// Navigation
import FiltersContainerView from '../views/filters-container.js';
// Filters
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
    this._tripControlsView = new TripControlsView();
    this._navigationContainerView = new NavigationContainerView();
    this._filtersContainerView = new FiltersContainerView();
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
    this._renderTripControls();
    render(this._tripMainView, this._eventAddButtonView);
  }

  _renderTripControls() {
    render(this._tripMainView, this._tripControlsView);
    render(this._tripControlsView, this._navigationContainerView);
    render(this._tripControlsView, this._filtersContainerView);
  }

  _renderMain() {
    render(this._applicationContainer, this._mainView);
    render(this._mainView, this._containerView);
    render(this._containerView, this._tripEventsView);
  }
}
