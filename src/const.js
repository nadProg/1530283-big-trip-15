export const KeyCode = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
};

export const Place = {
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
};

export const STATISCTICS_CHART_TYPE = 'horizontalBar';

export const STAISTICS_CHART_BAR_HEIGHT = 50;

export const STATISTICS_CHART_OPTIONS = {
  plugins: {
    datalabels: {
      font: {
        size: 20,
      },
      color: '#ffffff',
      anchor: 'start',
      align: 'start',
      offset: 40,
    },
  },
  scales: {
    yAxes: [{
      ticks: {
        fontColor: '#ffffff',
        padding: 100,
        fontSize: 20,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
    xAxes: [{
      ticks: {
        display: false,
        beginAtZero: true,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
};

export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

export const AUTHORIZATION = 'Basic b1dsf53b53b';

export const APIMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};
