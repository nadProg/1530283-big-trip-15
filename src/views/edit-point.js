import flatpickr from 'flatpickr';

import { PointType, DEFAULT_POINT, COMMON_DATEPICKER_OPTIONS } from '../const.js';
import { isEnter, enableForm, disableForm } from '../utils/common.js';

import SmartView from './smart.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

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

const createEditPointTemplate = (point) => {
  const { basePrice, offers: chosenOffers, type: chosenType, destination, availableOffers, availableDestinations, isNew } = point;

  const eventTypeItemsTemplate = Object.values(PointType)
    .map(createEventTypeItemTemplate)
    .join('');

  const destinatonOptionsTemplate = availableDestinations
    .map(({ name }) => createDestinationOptionTemplate(name))
    .join('');

  const offersListTemplate = availableOffers
    .map((offer, index) => {
      const isChecked = !!chosenOffers.find(({ title }) => title === offer.title);
      return createOfferTemplate(offer, index, isChecked);
    })
    .join('');

  const destinationPhotosTemplate = destination.pictures.map(createDestinationPhoto).join('');

  const resetButtonText = isNew ? 'Cancel' : 'Delete';

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
            <label class="visually-hidden" for="event-start-time">From</label>
            <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price" type="number" min="0" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${resetButtonText}</button>
          ${!isNew ? `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>` : ''}
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
  constructor(point, offers, destinations) {
    super();

    this._data = point ?
      {
        ...point,
        availableDestinations: [ ...destinations ],
      } :
      {
        ...DEFAULT_POINT,
        type: offers[0].type,
        destination: destinations[0],
        availableDestinations: [ ...destinations ],
      };

    this._offers = [ ...offers ];

    this._datePickers = {
      end: null,
      start: null,
    };

    this._resetHandler = this._resetHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._inputDestination = this._inputDestination.bind(this);
    this._changeOffers = this._changeOffers.bind(this);
    this._changeType = this._changeType.bind(this);
    this._changeBasePrice = this._changeBasePrice.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._keyDownDestinationHandler = this._keyDownDestinationHandler.bind(this);

    this._updateAvailableOffers(this._data.type);
    this.restoreHandlers();
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().addEventListener('submit', this._submitHandler);
  }

  setResetHandler(callback) {
    this._callback.reset = callback;
    this.getElement().addEventListener('reset', this._resetHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    if (!this._data.isNew) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupButtonClickHandler);
    }

    this.getElement().addEventListener('submit', this._submitHandler);
    this.getElement().addEventListener('reset', this._resetHandler);

    this._setDatePicker();
  }

  _setDatePicker() {
    if (this._datePickers.start) {
      this._datePickers.start.destroy();
    }

    if (this._datePickers.end) {
      this._datePickers.end.destroy();
    }

    const startDateElement = this.getElement().querySelector('#event-start-time');
    const endDateElement = this.getElement().querySelector('#event-end-time');

    this._datePickers.start = flatpickr(startDateElement, {
      ...COMMON_DATEPICKER_OPTIONS,
      defaultDate: this._data.date.start,
      maxDate: this._data.date.end,
      onChange: this._startDateChangeHandler,
    });

    this._datePickers.end = flatpickr(endDateElement, {
      ...COMMON_DATEPICKER_OPTIONS,
      defaultDate: this._data.date.end,
      minDate: this._data.date.start,
      onChange: this._endDateChangeHandler,
    });
  }

  _startDateChangeHandler([ newDate ]) {
    this.updateData({
      date: {
        start: newDate,
        end: this._data.date.end,
      },
    }, {  isElementUpdate: false });

    // this._datePickers.start.toggle();
    this._datePickers.end.set('minDate', newDate);
  }

  _endDateChangeHandler([ newDate ]) {
    this.updateData({
      date: {
        end: newDate,
        start: this._data.date.start,
      },
    }, {  isElementUpdate: false });

    // this._datePickers.end.toggle();
    this._datePickers.start.set('maxDate', newDate);
  }

  _getData() {
    const data = { ...this._data };

    delete data.isNew;
    delete data.availableOffers;
    delete data.availableDestinations;

    return data;
  }

  _updateAvailableOffers(newType) {
    const availableOffers = [ ...this._offers.find(({ type }) => type === newType).offers];
    this.updateData({ availableOffers }, { isElementUpdate: false });
  }

  _setInnerHandlers() {
    if (this._data.availableOffers.length) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._changeOffers);
    }

    this.getElement().querySelector('.event__type-group').addEventListener('change', this._changeType);
    this.getElement().querySelector('.event__input--destination').addEventListener('input', this._inputDestination);
    this.getElement().querySelector('.event__input--destination').addEventListener('keydown', this._keyDownDestinationHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._changeBasePrice);
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  async _submitHandler(evt) {
    evt.preventDefault();

    this._disable();
    this._setSubmitStatus();

    try {
      await this._callback.submit(this._getData());
    } catch (error) {
      this._applyShakeEffect();
    }

    this._enable();
    this._clearSubmitStatus();
  }

  async _resetHandler(evt) {
    evt.preventDefault();

    this._disable();
    this._setResetStatus();

    try {
      await this._callback.reset(this._data.id);
    } catch (error) {
      this._applyShakeEffect();
    }

    this._enable();
    this._clearResetStatus();
  }

  _changeOffers(evt) {
    const { checked, value } = evt.target;
    let offers = [ ...this._data.offers ];

    if (checked) {
      const newOffer = this._data.availableOffers.find(({ title }) => title === value);
      if (newOffer) {
        offers.push(newOffer);
      }
    } else {
      offers = this._data.offers.filter(({ title }) => title !== value);
    }

    this.updateData({ offers }, { isElementUpdate: false });
  }

  _changeType(evt) {
    const { value: type } = evt.target;
    this._updateAvailableOffers(type);
    this.updateData({
      type,
      offers: [],
    });
  }

  _inputDestination(evt) {
    const input = evt.target;
    const { value: destinationName } = input;
    const destination = this._data.availableDestinations.find(({ name }) => name === destinationName);

    if (destination) {
      input.setCustomValidity('');
      this.updateData({ destination });
      return;
    }

    input.setCustomValidity('Destination must be one of list values');
  }

  _keyDownDestinationHandler(evt) {
    if (isEnter(evt)) {
      evt.preventDefault();
    }
  }

  _changeBasePrice(evt) {
    this.updateData({
      basePrice: Number(evt.target.value),
    },
    {
      isElementUpdate: false,
    });
  }

  _enable() {
    enableForm(this.getElement().querySelector('.event'));
  }

  _disable() {
    disableForm(this.getElement().querySelector('.event'));
  }

  _applyShakeEffect() {
    const element =  this.getElement();
    element.classList.remove('shake');
    setTimeout(() => element.classList.add('shake'));
  }

  _setSubmitStatus() {
    this.getElement().querySelector('.event__save-btn').textContent = 'Saving...';
  }

  _clearSubmitStatus() {
    this.getElement().querySelector('.event__save-btn').textContent = 'Save';
  }

  _setResetStatus() {
    if (!this._data.isNew) {
      this.getElement().querySelector('.event__reset-btn').textContent = 'Deleting...';
    }
  }

  _clearResetStatus() {
    if (!this._data.isNew) {
      this.getElement().querySelector('.event__reset-btn').textContent = 'Delete';
    }
  }
}
