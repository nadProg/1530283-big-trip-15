import { StatiscticsType } from '../const';
import { formatDuration, getDuration } from './date';

const getStatistics = (points) => {
  const statistics = new Map();

  points.forEach(({ type, basePrice, date }) => {
    if (!statistics.has(type)) {
      statistics.set(type, {
        [StatiscticsType.MONEY]: 0,
        [StatiscticsType.TYPE]: 0,
        [StatiscticsType.TIME_SPEND]: getDuration(),
      });
    }

    const currentStatistics = statistics.get(type);

    statistics.set(type, {
      [StatiscticsType.TYPE]: currentStatistics[StatiscticsType.TYPE] + 1,
      [StatiscticsType.MONEY]: currentStatistics[StatiscticsType.MONEY] + basePrice,
      [StatiscticsType.TIME_SPEND]: currentStatistics[StatiscticsType.TIME_SPEND].add(getDuration(date.start, date.end)),
    });
  });

  return Array.from(statistics.entries());
};

const getDatasetFromStatistics = (statisctics, key) => {
  statisctics = [ ...statisctics ];

  statisctics.sort(([, datumA], [, datumB]) => {
    if (key === StatiscticsType.TIME_SPEND) {
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

  if (key === StatiscticsType.TIME_SPEND) {
    dataset.data = dataset.data.map(({ $ms }) => $ms);
  }

  return dataset;
};

export const getStatisticsDatasets = (points) => {
  const statisctics = getStatistics(points);

  return Object.values(StatiscticsType).map((type) => ({
    type,
    dataset: getDatasetFromStatistics(statisctics, type),
  }));
};

export const formatter = {
  [StatiscticsType.MONEY]:  (value) => `€ ${value}`,
  [StatiscticsType.TYPE]: (value) => `${value}x`,
  [StatiscticsType.TIME_SPEND]: (value) => formatDuration(value),
};
