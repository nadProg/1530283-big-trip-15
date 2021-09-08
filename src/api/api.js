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

  // async updateFilm(film) {
  //   const response = await this._load({
  //     url: `movies/${film.id}`,
  //     method: APIMethod.PUT,
  //     body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
  //   });

  //   const updatedFilm = await Api.toJSON(response);

  //   return FilmsModel.adaptFilmToClient(updatedFilm);
  // }

  // async getComments(filmId) {
  //   const response = await this._load({
  //     url: `comments/${filmId}`,
  //     method: APIMethod.GET,
  //   });

  //   const comments = await Api.toJSON(response);

  //   return comments.map(CommentsModel.adaptCommentToClient);
  // }


  // async addComment({ filmId, newComment }) {
  //   const response = await this._load({
  //     url: `comments/${filmId}`,
  //     method: APIMethod.POST,
  //     body: JSON.stringify(CommentsModel.adaptNewCommentToServer(newComment)),
  //   });

  //   const { movie, comments } = await Api.toJSON(response);

  //   return {
  //     updatedFilm: FilmsModel.adaptFilmToClient(movie),
  //     updatedComments: comments.map(CommentsModel.adaptCommentToClient),
  //   };
  // }

  // async deleteComment(commentId) {
  //   await this._load({
  //     url: `comments/${commentId}`,
  //     method: APIMethod.DELETE,
  //   });
  // }

  // async sync(films) {
  //   const response = await this._load({
  //     url: '/movies/sync',
  //     method: APIMethod.POST,
  //     body: JSON.stringify(films),
  //   });

  //   return await Api.toJSON(response);
  // }

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
