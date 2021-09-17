import { END_POINT, AUTHORIZATION, OFFLINE_POSTFIX, Message } from './const.js';
import { alert, AlertType } from './utils/alert.js';
import { isOnline } from './utils/common.js';

import ApplicationPresenter from './presenters/application-presenter.js';

import API from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider';

const store = new Store('big-trip-v15', window.localStorage);
const api = new API(END_POINT, AUTHORIZATION);
const provider = new Provider(api, store);

const applicationPresenter = new ApplicationPresenter({
  api: provider,
  container: document.body,
});

const onWindowOffline = () => {
  document.title += OFFLINE_POSTFIX;
  alert(Message.OFFLINE);
};

if (!isOnline()) {
  onWindowOffline();
}

applicationPresenter.init();

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_POSTFIX, '');
  alert(Message.ONLINE, { type: AlertType.SUCCESS });
  provider.sync();
});

window.addEventListener('offline', onWindowOffline);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
