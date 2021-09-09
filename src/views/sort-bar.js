import { SortType } from '../const.js';
import AbstractView from './abstract.js';

const createSortItemTemplate = (sortType, isChecked) => {
  const isDisabled = sortType === SortType.EVENT || sortType === SortType.OFFERS ? 'disabled' : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${sortType}" data-sort-type="${sortType}">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" ${isChecked ? 'checked' : ''} ${isDisabled}>
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

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createSortBarTemplate(this._activeSortType);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    const sortItem = evt.target.closest('.trip-sort__item');

    if (!sortItem || !evt.currentTarget.contains(sortItem)) {
      return;
    }

    const { sortType } = sortItem.dataset;

    if (sortType !== SortType.EVENT && sortType !== SortType.OFFERS) {
      this._callback.click(sortType);
    }
  }
}
