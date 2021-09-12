import { APIMethod, SuccessHTTPStatusRange } from '../const.js';

import PointsModel from '../models/points.js';
// import CommentsModel from '../models/comments.js';

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async getPoints() {
    const response = await this._load({
      url: 'points',
    });

    const points = await Api.toJSON(response);

    return points.map(PointsModel.adaptPointToClient);
  }

  async getOffers() {
    const response = await this._load({
      url: 'offers',
    });

    const offers = await Api.toJSON(response);

    return offers;
  }

  async getDestinations() {
    const response = await this._load({
      url: 'destinations',
    });

    const destinations = await Api.toJSON(response);

    return destinations;
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: APIMethod.PUT,
      body: JSON.stringify(PointsModel.adaptPointToServer(point)),
    });

    const updatedPoint = await Api.toJSON(response);

    return PointsModel.adaptPointToClient(updatedPoint);
  }

  async createPoint(point) {
    const response = await this._load({
      url: 'points',
      method: APIMethod.POST,
      body: JSON.stringify(PointsModel.adaptPointToServer(point)),
    });

    const createdPoint = await Api.toJSON(response);

    return PointsModel.adaptPointToClient(createdPoint);
  }

  async deletePoint(pointId) {
    await this._load({
      url: `points/${pointId}`,
      method: APIMethod.DELETE,
    });
  }

  async sync(points) {
    const response = await this._load({
      url: '/points/sync',
      method: APIMethod.POST,
      body: JSON.stringify(points),
    });

    return await Api.toJSON(response);
  }

  async _load({
    url,
    method = APIMethod.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this._authorization);

    const fetchUrl = `${this._endPoint}/${url}`;
    const fetchOptions = { method, body, headers };
    const response = await fetch(fetchUrl, fetchOptions);

    return Api.checkStatus(response);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}
