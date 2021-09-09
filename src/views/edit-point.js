import SmartView from './smart.js';

import { PointType } from '../const.js';
import { formatInputDate } from '../utils/date.js';

const createEventTypeItemTemplate = (value) => {
  const text = value;
  value = text.toLowerCase();
  return `
    <div class="event__type-item">
      <input id="event-type-${value}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}">
      <label class="event__type-label  event__type-label--${value}" for="event-type-${value}">${text}</label>
    </div>
  `;
};

const createDestinationOptionTemplate = (value) => `<option value="${value}"></option>`;

const createOfferTemplate = ({ title, price }, index, isChecked = false) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${isChecked ? 'checked' : ''} value="${title}">
    <label class="event__offer-label" for="event-offer-${index}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createDestinationPhoto = ({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`;

const createEditPointTemplate = ({ date, basePrice, offers: chosenOffers, type: chosenType, destination }, availableOffers, destinations) => {
  const eventTypeItemsTemplate = Object.values(PointType)
    .map(createEventTypeItemTemplate)
    .join('');

  const destinatonOptionsTemplate = destinations
    .map(({ name }) => createDestinationOptionTemplate(name))
    .join('');

  const offersListTemplate = availableOffers
    .map((offer, index) => {
      const isChecked = !!chosenOffers.find(({ title }) => title === offer.title);
      return createOfferTemplate(offer, index, isChecked);
    })
    .join('');

  const destinationPhotosTemplate = destination.pictures.map(createDestinationPhoto).join('');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${chosenType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypeItemsTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination">
              ${chosenType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${destination.name}" list="destination-list">
            <datalist id="destination-list">
              ${destinatonOptionsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatInputDate(date.start)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatInputDate(date.end)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${availableOffers.length ? `
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersListTemplate}
              </div>
            </section>
          ` : ''}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
            <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France,
              ${destination.description}
            </p>
            ${ destination.pictures.length ? `
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${destinationPhotosTemplate}
                </div>
              </div>
            ` : ''}
          </section>
        </section>
      </form>
    </li>
  `;
};

export default class EditPointView extends SmartView {
  constructor(point = {}, offers = [], destinations = []) {
    super();

    this._data = { ...point };
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];

    this._availableOffers = [];

    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._changeOffers = this._changeOffers.bind(this);
    this._changeType = this._changeType.bind(this);

    this._updateAvailableOffers();
    this.restoreHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data, this._availableOffers, this._destinations);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
  }

  restoreHandlers() {
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
    this._setInnerHandlers();
  }

  _updateAvailableOffers() {
    this._availableOffers = this._offers.find(({ type }) => type === this._data.type).offers;
  }

  _setInnerHandlers() {
    if (this._availableOffers.length) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._changeOffers);
    }

    this.getElement().querySelector('.event__type-group').addEventListener('change', this._changeType);
  }

  // Удаление

  // Сохранение

  _changeOffers(evt) {
    const { checked, value } = evt.target;
    if (checked) {
      const newOffer = this._availableOffers.find(({ title }) => title === value);
      if (newOffer) {
        this._data.offers.push(newOffer);
      }
    } else {
      this._data.offers = this._data.offers.filter(({ title }) => title !== value);
    }
  }

  _changeType(evt) {
    this._updateAvailableOffers();
    this.updateData({
      offers: [],
      type: evt.target.value,
    });
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }
}
