import AbstractView from './abstract-view.js';

const createMainTemplate = () => '<main class="page-body__page-main  page-main"></main>';

export default class MainView extends AbstractView {
  getTemplate() {
    return createMainTemplate();
  }
}
