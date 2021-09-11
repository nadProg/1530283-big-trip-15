import { getDuration } from './date';

export const getStatistics = (points) => {
  const statistics = new Map();

  points.forEach(({ type, basePrice, date }) => {
    if (!statistics.has(type)) {
      statistics.set(type, {
        times: 0,
        timeSpend: getDuration(),
        totalPrice: 0,
      });
    }

    const currentStatistics = statistics.get(type);

    statistics.set(type, {
      times: currentStatistics.times + 1,
      timeSpend: currentStatistics.timeSpend.add(getDuration(date.start, date.end)),
      totalPrice: currentStatistics.totalPrice + basePrice,
    });
  });

  return statistics;
};

// export const getMoneyStatistics = (points) => {
//   const statistics = new Map();

//   points.forEach(({ type, basePrice }) => {
//     if (!statistics.has(type)) {
//       statistics.set(type, 0);
//     }

//     statistics.set(type, statistics.get(type) + basePrice);
//   });

//   return statistics.entries();
// };

// export const getTypeStatistics = (points) => {
//   const statistics = new Map();

//   points.forEach(({ type }) => {
//     if (!statistics.has(type)) {
//       statistics.set(type, 0);
//     }

//     statistics.set(type, statistics.get(type) + 1);
//   });

//   return statistics.entries();
// };
