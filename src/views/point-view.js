import {
  formdatEventDate, formatTime,
  formatDateTime, formatDuration, getDuration
} from '../utils/date.js';

import AbstractView from './abstract-view.js';

const createOfferItemTemplate = ({ title, price }) => `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>
`;

const createPointTemplate = ({ date, basePrice, offers, type, destination, isFavorite }) => {
  const offersListTemplate = offers.map(createOfferItemTemplate).join('');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatDateTime(date.start)}">${formdatEventDate(date.start)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateTime(date.start)}">${formatTime(date.start)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateTime(date.end)}">${formatTime(date.end)}</time>
          </p>
          <p class="event__duration">${formatDuration(getDuration(date.start, date.end))}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        ${ offersListTemplate ? `
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersListTemplate}
          </ul>` : ''}

        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class PointView extends AbstractView {
  constructor(point) {
    super();

    this._point = { ...point };

    this._openButtonClickHandler = this._openButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setOpenButtonClickHandler(callback) {
    this._callback.openButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._openButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteButtonClickHandler);
  }

  _openButtonClickHandler() {
    this._callback.openButtonClick();
  }

  _favoriteButtonClickHandler() {
    this._callback.favoriteButtonClick();
  }
}
