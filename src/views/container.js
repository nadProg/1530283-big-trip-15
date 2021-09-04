import AbstractView from './abstract.js';

export const createContainerTemplate = () => '<div class="page-body__container"></div>';

export default class MainView extends AbstractView {
  getTemplate() {
    return createContainerTemplate();
  }
}
