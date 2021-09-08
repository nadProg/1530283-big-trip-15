import { END_POINT, AUTHORIZATION } from './const.js';

import ApplicationPresenter from './presenters/application.js';

import API from './api/api.js';

const api = new API(END_POINT, AUTHORIZATION);

const applicationPresenter = new ApplicationPresenter({
  api,
  container: document.body,
});

applicationPresenter.init();
