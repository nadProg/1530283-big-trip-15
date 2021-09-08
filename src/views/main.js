import AbstractView from './abstract.js';

const createMainTemplate = () => '<main class="page-body__page-main  page-main"></main>';

export default class MainView extends AbstractView {
  getTemplate() {
    return createMainTemplate();
  }
}
