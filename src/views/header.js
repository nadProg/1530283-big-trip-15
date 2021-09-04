import AbstractView from './abstract.js';

export const createHeaderTemplate = () => '<header class="page-header"></header>';

export default class HeaderView extends AbstractView {
  getTemplate() {
    return createHeaderTemplate();
  }
}
