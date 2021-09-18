import { Screen } from '../const.js';

import AbstractView from './abstract-view.js';

const createNavigationItemTemplate = (item, isActive) => `
  <a
    class="trip-tabs__btn  ${isActive ? 'trip-tabs__btn--active' : ''}"
    href="#${item}"
    data-screen="${item}"
  >${item.toUpperCase()}</a>
`;

const createNavigationTemplate = (activeItem) => {
  const navigationItemsTemplate = Object.values(Screen)
    .map((item) => createNavigationItemTemplate(item, item === activeItem))
    .join('');

  return `
    <div class="trip-controls__navigation">
      <h2 class="visually-hidden">Switch trip view</h2>
      <nav class="trip-controls__trip-tabs  trip-tabs">
        ${navigationItemsTemplate}
      </nav>
    </div>
  `;
};

export default class NavigationView extends AbstractView {
  constructor(activeItem = Screen.TABLE) {
    super();

    this._activeItem = activeItem;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNavigationTemplate(this._activeItem);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    const link = evt.target.closest('.trip-tabs__btn');

    if (!link && !evt.currentTarget.contains(link)) {
      return;
    }

    evt.preventDefault();
    this._callback.click(link.dataset.screen);
  }
}
