import { SortType } from '../const.js';

import AbstractView from './abstract.js';

const createSortItemTemplate = (sortType, isChecked) => {
  const isDisabled = sortType === SortType.EVENT || sortType === SortType.OFFERS ? 'disabled' : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortType}" ${isChecked ? 'checked' : ''} ${isDisabled}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
    </div>
  `;
};

const createSortBarTemplate = (activeSortType) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((sortType) => createSortItemTemplate(sortType, sortType === activeSortType)).join('')}
  </form>
`;

export default class SortBarView extends AbstractView {
  constructor(activeSortType) {
    super();

    this._activeSortType = activeSortType;

    this._changeHandler = this._changeHandler.bind(this);
  }

  getTemplate() {
    return createSortBarTemplate(this._activeSortType);
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
