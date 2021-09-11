import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  STATISTICS_CHART_BAR_HEIGHT, STATISCTICS_CHART_TYPE, STATISTICS_CHART_OPTIONS
} from '../const.js';

import AbstractView from './abstract.js';

const createStatisticsTemplate = () => `
  <section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>
`;

export default class StatisticsView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    this._renderChart('money', {});
    this._renderChart('type', {});
    this._renderChart('time-spend', {});
  }

  _renderChart(id, statistics) {
    if (!statistics) {
      return;
    }

    const statisticsContext = this.getElement().querySelector(`#${id}`);

    statisticsContext.height = STATISTICS_CHART_BAR_HEIGHT * 5;

    new Chart(statisticsContext, {
      plugins: [ChartDataLabels],
      type: STATISCTICS_CHART_TYPE,
      options: { ...STATISTICS_CHART_OPTIONS},
      // data: getStatisticsChartData(genresStatistic),
    });
  }
}
