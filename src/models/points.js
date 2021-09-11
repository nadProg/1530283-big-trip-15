import { updateItem } from '../utils/common.js';
import { sortByStartDate } from '../utils/point.js';

import AbstractObserver from '../utils/abstract-observer.js';

export default class PointsModel extends AbstractObserver {
  constructor(points = []) {
    super();

    this._points = [ ...points ];
  }

  getAll() {
    return this._points;
  }

  setPoints(updateType, points) {
    this._points = [ ...points ];
    this._points.sort(sortByStartDate);

    this._notify(updateType, points);
  }

  createPoint(updateType, newPoint) {
    newPoint = {
      ...newPoint,
      id: this.getAll().length + 1,
    };

    this._points = [ ...this._points, newPoint ];
    this._points.sort(sortByStartDate);

    this._notify(updateType, newPoint);
  }

  updatePoint(updateType, updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._points.sort(sortByStartDate);

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, deletedPointId) {
    this._points = this._points.filter(({id}) => id !== deletedPointId);

    this._notify(updateType, deletedPointId);
  }

  static adaptPointToClient(point) {
    const clientPoint = { ...point };

    clientPoint.basePrice = point['base_price'];
    clientPoint.date = {
      end: new Date(point['date_to']),
      start: new Date(point['date_from']),
    };
    clientPoint.isFavorite = point['is_favorite'];

    delete clientPoint['base_price'];
    delete clientPoint['date_to'];
    delete clientPoint['date_from'];
    delete clientPoint['is_favorite'];

    return clientPoint;
  }
}
