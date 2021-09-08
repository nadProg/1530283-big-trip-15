export default class PointsModel {
  static adaptPointToClient(point) {
    const clientPoint = { ...point };

    clientPoint.basePrice = point['base_price'];
    clientPoint.date = {
      to: new Date(point['date_to']),
      from: new Date(point['date_from']),
    };
    clientPoint.isFavorite = point['is_favorite'];

    delete clientPoint['base_price'];
    delete clientPoint['date_to'];
    delete clientPoint['date_from'];
    delete clientPoint['is_favorite'];

    return clientPoint;
  }
}
