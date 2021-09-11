import { FilterType } from '../const.js';

import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, isChecked, isDisabled) => `
  <div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden"
      type="radio" name="trip-filter" value="${filter}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>
`;

const createFiltersTemplate = (activeFilter, filters) => `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      ${Object.values(filters).map(({ type, count }) => createFilterItemTemplate(type, type === activeFilter, !count)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>
`;

export default class FiltersView extends AbstractView {
  constructor(activeFilter = FilterType.ALL, filters) {
    super();

    this._activeFilter = activeFilter;
    this._filters = filters;

    this._changeHandler = this._changeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._activeFilter, this._filters);
  }

  setChangeHandler(callback) {
    this._callback.change = callback;
    this.getElement().addEventListener('change', this._changeHandler);
  }

  _changeHandler(evt) {
    const { value } = evt.target;
    this._callback.change(value);
  }
}
