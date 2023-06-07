const TRIP_EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const SORT_TYPE = {
  DAY: 'day',
  PRICE: 'price',
};

const USER_ACTION = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const DESTINATION_NAMES = [
  'Moscow',
  'SPB',
  'Voroneg',
  'Tula',
  'Orel',
];

export { DESTINATION_NAMES, FILTER_TYPE, TRIP_EVENT_TYPES, SORT_TYPE, USER_ACTION, UPDATE_TYPE };
