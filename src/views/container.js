import AbstractView from './abstract.js';

const createContainerTemplate = () => '<div class="page-body__container"></div>';

export default class MainView extends AbstractView {
  getTemplate() {
    return createContainerTemplate();
  }
}
