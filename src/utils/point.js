export const sortByStartDate = (pointA, pointB) => pointA.date.start - pointB.date.start;

export const sortByTime = (pointA, pointB) => (pointA.date.end - pointA.date.start) - (pointB.date.end - pointB.date.start);

export const sortByBasePrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;
