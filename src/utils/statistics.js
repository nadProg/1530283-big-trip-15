import { getDuration } from './date';

const getStatistics = (points) => {
  const statistics = new Map();

  points.forEach(({ type, basePrice, date }) => {
    if (!statistics.has(type)) {
      statistics.set(type, {
        times: 0,
        timeSpend: getDuration(),
        money: 0,
      });
    }

    const currentStatistics = statistics.get(type);

    statistics.set(type, {
      times: currentStatistics.times + 1,
      timeSpend: currentStatistics.timeSpend.add(getDuration(date.start, date.end)),
      money: currentStatistics.money + basePrice,
    });
  });

  return Array.from(statistics.entries());
};

const getDatasetFromStatistics = (statisctics, key) => {
  statisctics = [ ...statisctics ];

  statisctics.sort(([, datumA], [, datumB]) => {
    if (key === 'timeSpend') {
      return datumB[key].$ms - datumA[key].$ms;
    }

    return datumB[key] - datumA[key];
  });

  const dataset = {
    labels: [],
    data: [],
  };

  statisctics.forEach(([ label, datum ]) => {
    dataset.data.push(datum[key]);
    dataset.labels.push(label);
  });

  return dataset;
};

export const getStatisticsDatasets = (points) => {
  const statisctics = getStatistics(points);

  console.log(statisctics);

  console.log('Money');
  console.log(getDatasetFromStatistics(statisctics, 'money'));

  console.log('Type');
  console.log(getDatasetFromStatistics(statisctics, 'times'));

  console.log('TimeSpend');
  console.log(getDatasetFromStatistics(statisctics, 'timeSpend'));

};
