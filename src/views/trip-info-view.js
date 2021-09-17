import { formatTripCities } from '../utils/point.js';
import { formatTripDate } from '../utils/date.js';

import AbstractView from './abstract-view.js';

const createTripInfoTemplate = ({ tripCities, price, tripDate }) => `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${formatTripCities(tripCities)}</h1>
      <p class="trip-info__dates">${formatTripDate(tripDate)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>
  </section>
`;

export default class TripInfoView extends AbstractView {
  constructor(info) {
    super();

    this._info = info;
  }

  getTemplate() {
    return createTripInfoTemplate(this._info);
  }
}
