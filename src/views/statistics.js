import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { formatter } from '../utils/statistics.js';

import {
  STATISTICS_CHART_BAR_HEIGHT, STATISCTICS_CHART_TYPE, STATISTICS_CHART_OPTIONS
} from '../const.js';

import AbstractView from './abstract.js';

const createCanvasTemplate = (type) => `
  <div class="statistics__item">
    <canvas class="statistics__chart" id="${type}" width="900"></canvas>
  </div>
`;

const createStatisticsTemplate = (statistics) => {
  const canvasTemplates = statistics
    .map(({ type }) => createCanvasTemplate(type))
    .join('');

  return `
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      ${canvasTemplates}
    </section>
  `;
};

export default class StatisticsView extends AbstractView {
  constructor(statistics) {
    super();

    this._statistics = statistics;
  }

  getTemplate() {
    setTimeout(() => this._renderCharts());
    return createStatisticsTemplate(this._statistics);

  }

  _renderCharts() {
    Object.values(this._statistics).forEach(({ type, dataset }) => {
      this._renderChart(type, dataset);
    });
  }

  _renderChart(type, dataset) {
    if (!dataset.data.length ) {
      return;
    }

    const statisticsContext = this.getElement().querySelector(`#${type}`);

    statisticsContext.height = STATISTICS_CHART_BAR_HEIGHT * dataset.data.length;

    new Chart(statisticsContext, {
      plugins: [ChartDataLabels],
      type: STATISCTICS_CHART_TYPE,
      options: {
        ...STATISTICS_CHART_OPTIONS,
        title: {
          ...STATISTICS_CHART_OPTIONS.title,
          text: type.toUpperCase(),
        },
        plugins: {
          datalabels: {
            ...STATISTICS_CHART_OPTIONS.plugins.datalabels,
            formatter: formatter[type],
          },
        },
      },
      data: {
        labels: dataset.labels.map((label) => label.toUpperCase()),
        datasets: [{
          data: [ ...dataset.data ],
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
        }],
      },
    });
  }
}
