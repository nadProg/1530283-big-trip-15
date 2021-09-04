import AbstractView from './abstract.js';

export const createFiltersContainerTemplate = () => `
  <div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <!-- Фильтры -->
  </div>
`;

export default class FiltersContainerView extends AbstractView {
  getTemplate() {
    return createFiltersContainerTemplate();
  }
}
