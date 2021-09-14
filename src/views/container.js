import AbstractView from './abstract.js';

const createContainerTemplate = () => '<div class="page-body__container"></div>';

export default class ContainerView extends AbstractView {
  getTemplate() {
    return createContainerTemplate();
  }
}
