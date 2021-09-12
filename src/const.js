export const KeyCode = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
};

export const Place = {
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
};

export const STATISCTICS_CHART_TYPE = 'horizontalBar';

export const STATISTICS_CHART_BAR_HEIGHT = 55;

export const STATISTICS_CHART_OPTIONS = {
  plugins: {
    datalabels: {
      font: {
        size: 13,
      },
      color: '#000000',
      anchor: 'end',
      align: 'start',
      // formatter: (val) => `€ ${val}`,
    },
  },
  title: {
    display: true,
    text: 'MONEY',
    fontColor: '#000000',
    fontSize: 23,
    position: 'left',
  },
  scales: {
    yAxes: [{
      ticks: {
        fontColor: '#000000',
        padding: 5,
        fontSize: 13,
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
  TABLE: 'table',
  STATISCTICS: 'statisctics',
};

export const DEFAULT_POINT = {
  date: {
    end: new Date(Date.now() + 1000 * 60 * 60 * 24),
    start: new Date(),
  },
  basePrice: 100,
  destination: null,
  destinationName: '',
  offers: [],
  isNew: true,
  isFavorite: false,
};

export const UserAction = {
  CREATE_POINT: 'create-point',
  UPDATE_POINT: 'update-point',
  DELETE_POINT: 'delete-point',
};

export const UpdateType = {
  INIT: 'init',
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
};

export const StatiscticsType = {
  MONEY: 'money',
  TYPE: 'type',
  TIME_SPEND: 'time-spend',
};

export const COMMON_DATEPICKER_OPTIONS = {
  enableTime: true,
  dateFormat: 'd/m/y H:i',
};

export const Message = {
  LOADING: 'Loading...',
  CREATE_POINT: 'Click New Event to create your first point',
  NO_FUTURE_POINTS: 'There are no future events now',
  NO_PAST_POINTS: 'There are no past events now',
  CREATE_IN_OFLLINE: 'You can\'t create new points in offline mode',
  EDIT_IN_OFFLINE: 'You can\'t edit points in offline mode',
  DELETE_IN_OFFLINE: 'You can\'t delete points in offline mode',
  ONLINE: 'On-line mode',
  OFFLINE: 'Off-line mode',
};

export const filterTypeToMessage = {
  past: Message.NO_PAST_POINTS,
  future: Message.NO_FUTURE_POINTS,
  everything: Message.CREATE_POINT,
};

export const OFFLINE_POSTFIX = ' [offline]';
