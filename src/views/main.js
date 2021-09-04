import AbstractView from './abstract.js';

export const createMainTemplate = () => '<main class="page-body__page-main  page-main"></main>';

export default class MainView extends AbstractView {
  getTemplate() {
    return createMainTemplate();
  }
}
