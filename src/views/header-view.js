import AbstractView from './abstract-view.js';

const createHeaderTemplate = () => '<header class="page-header"></header>';

export default class HeaderView extends AbstractView {
  getTemplate() {
    return createHeaderTemplate();
  }
}
