import AbstractView from './abstract.js';

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

const createOfferTemplate = ({ title, price }, checked = false) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage" type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-luggage">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createDestinationPhoto = ({ src, description }) => `<img class="event__photo" src="${src}" alt="${description}">`;

const createEditPointTemplate = ({ date, basePrice, offers: chosenOffers, type: chosenType, destination }, offers, destinations) => {
  const eventTypeItemsTemplate = Object.values(PointType).map(createEventTypeItemTemplate).join('');
  const destinatonOptionsTemplate = destinations.map(({ name }) => createDestinationOptionTemplate(name)).join('');
  const availableOffers = offers.find(({ type }) => type === chosenType).offers;
  const offersListTemplate = availableOffers.map((offer) => createOfferTemplate(offer)).join('');
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
              Flight
            </label>
            <input class="event__input  event__input--destination" id="event-destination" type="text" name="event-destination" value="${destination.name}" list="destination-list">
            <datalist id="destination-list">
              ${destinatonOptionsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatInputDate(date.from)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatInputDate(date.to)}">
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

export default class EditPointView extends AbstractView {
  constructor(point = {}, offers = {}, destinations = []) {
    super();

    this._point = { ...point };
    this._offers = [ ...offers ];
    this._destinations = [ ...destinations ];
  }

  getTemplate() {
    return createEditPointTemplate(this._point, this._offers, this._destinations);
  }
}
