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
      this._store.setItems(items);
      this._store.isSyncRequired = false;

      return points;
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptPointToClient));
  }

  async updatePoint(point) {
    if (isOnline()) {
      const updatedPoint = await this._api.updatePoint(point);

      this._store.setItem(updatedPoint.id, PointsModel.adaptPointToServer(updatedPoint));

      return updatedPoint;
    }

    this._store.setItem(point.id, PointsModel.adaptPointToServer(point));
    this._store.isSyncRequired = true;

    return Promise.resolve(point);
  }

  async deletePoint(pointId) {
    if (isOnline()) {
      await this._api.deletePoint(pointId);
      this._store.removeItem(pointId);
      return;
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  async createPoint(point) {
    if (isOnline()) {
      const createdPoint = await this._api.createPoint(point);
      this._store.setItem(createdPoint.id, PointsModel.adaptPointToServer(createdPoint));
      return createdPoint;
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

  async sync() {
    if (isOnline()) {
      if (!this._store.isSyncRequired) {
        return;
      }

      const storePoint = Object.values(this._store.getItems());

      const response = await this._api.sync(storePoint);
      const updatedPoints = Provider.getSyncedPoints(response.updated);
      const createdPoints = Provider.getSyncedPoints(response.updated);

      const items = Provider.createStoreStructure([ ...updatedPoints, ...createdPoints ]);
      this._store.setItems(items);
      this._store.isSyncRequired = false;

      return;
    }

    return Promise.reject(new Error('Sync data failed'));
  }

  static createStoreStructure(items) {
    return items.reduce((store, item) => ({
      ...store,
      [item.id]: item,
    }), {});
  }

  static getSyncedPoints(items) {
    return items
      .filter(({ success }) => success)
      .map(({ payload }) => payload.point);
  }
}
