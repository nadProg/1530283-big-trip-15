import { FilterType } from '../const';
import { isPointDuringToday, isStartInFuture, isEndInPast } from './date';

const findMaxEndDate = (points) => {
  let maxDate = points[0].date.end;

  points.forEach((point) => {
    if (point.date.end > maxDate) {
      maxDate = point.date.end;
    }
  });

  return maxDate;
};

export const sortByStartDate = (pointA, pointB) => pointA.date.start - pointB.date.start;

export const sortByTime = (pointA, pointB) => (pointA.date.end - pointA.date.start) - (pointB.date.end - pointB.date.start);

export const sortByBasePrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export const filter = {
  [FilterType.ALL]: (points) => [ ...points ],
  [FilterType.PAST]: (points) => points.filter(({ date }) => isPointDuringToday(date) || isEndInPast(date)),
  [FilterType.FUTURE]: (points) => points.filter(({ date }) => isPointDuringToday(date) || isStartInFuture(date)),
};

export const getTripPrice = (points) => points.reduce((tripPrice, point) => {
  const offersPrice = point.offers.reduce((price, offer) => price + offer.price, 0);
  return tripPrice + point.basePrice + offersPrice;
}, 0);

export const getTripCities = (points) => points.map(({ destination }) => destination.name);

export const getTripDate = (points) => {
  if (!points.length) {
    return null;
  }

  return {
    start: points[0].date.start,
    end: findMaxEndDate(points),
  };
};

export const formatTripCities = (cities) => {
  if (cities.length > 3) {
    cities = [ cities[0], '...', cities[cities.length - 1]];
  }

  return cities.join('&nbsp;&mdash;&nbsp;');
};
