export const sortByStartDate = (pointA, pointB) => pointA.date.from - pointB.date.from;

export const sortByTime = (pointA, pointB) => (pointA.date.to - pointA.date.from) - (pointB.date.to - pointB.date.from);

export const sortByBasePrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;
