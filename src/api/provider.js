import { isOnline } from '../utils/common.js';

import PointsModel from '../models/points.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  async getPoints() {
    if (isOnline()) {
      const points = await this._api.getPoints();

      const pointsAdaptedToServer = points.map(PointsModel.adaptPointToServer);
      const items = Provider.createStoreStructure(pointsAdaptedToServer);
      this._store.setItems(items, 'Points');
      // this._store.isSyncRequired = false;

      return points;
    }

    const storePoints = Object.values(this._store.getItems('Points'));

    return Promise.resolve(storePoints.map(PointsModel.adaptPointToClient));
  }

  async updatePoint(point) {
    if (isOnline()) {
      return await this._api.updatePoint(point);
    }

    return Promise.reject(new Error('Update point failed'));
  }

  async deletePoint(pointId) {
    if (isOnline()) {
      return await this._api.deletePoint(pointId);
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  async createPoint(point) {
    if (isOnline()) {
      return await this._api.createPoint(point);
    }

    return Promise.reject(new Error('Create point failed'));
  }

  async getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    return Promise.reject(new Error('Get offers failed'));
  }

  async getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations();
    }

    return Promise.reject(new Error('Get destinations failed'));
  }


  // async updateFilm(film, { isServerUpdate = true} = {} ) {
  //   if (isOnline()) {
  //     const updatedFilm = isServerUpdate ? await this._api.updateFilm(film) : film;

  //     this._store.setItem(updatedFilm.id, FilmsModel.adaptFilmToServer(updatedFilm));

  //     return updatedFilm;
  //   }

  //   this._store.setItem(film.id, FilmsModel.adaptFilmToServer({ ...film }));
  //   this._store.isSyncRequired = true;

  //   return Promise.resolve(film);
  // }

  // async getComments(filmId) {
  //   if (isOnline()) {
  //     return await this._api.getComments(filmId);
  //   }

  //   return Promise.reject(new Error('Get comments failed'));
  // }

  // async addComment(filmId, newComment) {
  //   if (isOnline()) {
  //     const updatedPayload = await this._api.addComment(filmId, newComment);

  //     const { updatedFilm } = updatedPayload;
  //     this._store.setItem(updatedFilm.id, FilmsModel.adaptFilmToServer(updatedFilm));

  //     return updatedPayload;
  //   }

  //   return Promise.reject(new Error('Create comment failed'));
  // }

  // async deleteComment(id) {
  //   if (isOnline()) {
  //     await this._api.deleteComment(id);
  //     return;
  //   }

  //   return Promise.reject(new Error('Delete comment failed'));
  // }

  // async sync() {
  //   if (isOnline()) {
  //     if (!this._store.isSyncRequired) {
  //       return;
  //     }

  //     const storeFilms = Object.values(this._store.getItems());

  //     const { updated: updatedFilms } = await this._api.sync(storeFilms);

  //     const items = Provider.createStoreStructure([ ...updatedFilms ]);
  //     this._store.setItems(items);
  //     this._store.isSyncRequired = false;

  //     return;
  //   }

  //   return Promise.reject(new Error('Sync data failed'));
  // }

  static createStoreStructure(items) {
    return items.reduce((store, item, index) => ({
      ...store,
      [item.id]: item,
    }), {});
  }
}
