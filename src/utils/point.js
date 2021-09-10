import { FilterType } from '../const';
import { isPointDuringToday, isStartInFuture, isEndInPast } from './date';

export const sortByStartDate = (pointA, pointB) => pointA.date.start - pointB.date.start;

export const sortByTime = (pointA, pointB) => (pointA.date.end - pointA.date.start) - (pointB.date.end - pointB.date.start);

export const sortByBasePrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export const filter = {
  [FilterType.ALL]: (points) => [ ...points ],
  [FilterType.PAST]: (points) => points.filter(({ date }) => isPointDuringToday(date) || isEndInPast(date)),
  [FilterType.FUTURE]: (points) => points.filter(({ date }) => isPointDuringToday(date) || isStartInFuture(date)),
};

export const getTripPrice = (points) => points.reduce((tripPrice, point) => {
  console.log(point);
  const offersPrice = point.offers.reduce((price, offer) => price + offer.price, 0);
  return tripPrice + point.basePrice + offersPrice;
}, 0);
