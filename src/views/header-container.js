import AbstractView from './abstract.js';

export const createHeaderContainerTemplate = () => `
  <div class="page-body__container  page-header__container">
    <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">
  </div>
`;

export default class HeaderContainerView extends AbstractView {
  getTemplate() {
    return createHeaderContainerTemplate();
  }
}
