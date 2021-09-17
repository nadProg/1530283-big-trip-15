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

    const end = new Date(point['date_to']);
    const start = new Date(point['date_from']);

    end.setSeconds(0);
    start.setSeconds(0);
    end.setMilliseconds(0);
    start.setMilliseconds(0);

    clientPoint.date = { start, end };

    clientPoint.basePrice = point['base_price'];
    clientPoint.isFavorite = point['is_favorite'];

    delete clientPoint['date_to'];
    delete clientPoint['date_from'];
    delete clientPoint['base_price'];
    delete clientPoint['is_favorite'];

    return clientPoint;
  }

  static adaptPointToServer(point) {
    const serverPoint = { ...point };

    serverPoint['base_price'] = point.basePrice;
    serverPoint['is_favorite'] = point.isFavorite;
    serverPoint['date_to'] = point.date.end.toISOString();
    serverPoint['date_from'] = point.date.start.toISOString();

    delete serverPoint.date;
    delete serverPoint.basePrice;
    delete serverPoint.isFavorite;

    return serverPoint;
  }
}
