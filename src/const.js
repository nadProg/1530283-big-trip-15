export const KeyCode = {
  // ENTER: 'Enter',
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

export const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

export const AUTHORIZATION = 'Basic Rj6gkb1dsf53b53b';

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

export const PointType = {
  TAXI: 'Taxi',
  BUS: 'Bus',
  TRAIN: 'Train',
  SHIP: 'Ship',
  DRIVE: 'Drive',
  FLIGHT: 'Flight',
  CHECK_IN: 'Check-in',
  SIGHTSEEING: 'Sightseeing',
  RESTAURANT: 'Restaurant',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const FilterType = {
  ALL: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const Screen = {
  TRIP: 'trip',
  STATISCTICS: 'statisctics',
};

export const DEFAULT_POINT = {
  date: {
    end: new Date(),
    start: new Date(),
  },
  basePrice: 100,
  offers: [],
  isNew: true,
};
