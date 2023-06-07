import dayjs from 'dayjs';
import { FILTER_TYPE, DESTINATION_NAMES } from './const';

const getRandomInt = (min, max) => {
  if (max < min) {
    throw Error('Incorrect range');
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomArrayElement = (array) => {
  const index = getRandomInt(0, array.length - 1);
  return array[index];
};

const getDate = (date) => dayjs(date).format('MMM D');
const getTime = (date) => dayjs(date).format('HH-mm');
const getFullDataTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');

const sortDays = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateTo, taskB.dateTo);

  return weight ?? dayjs(taskA.dateTo).diff(dayjs(taskB.dateTo));
};

const sortPrices = (taskA, taskB) => taskB.basePrice - taskA.basePrice;

const isDateFuture = (date) => {
  const currentDate = dayjs();
  const targetDate = dayjs(date);
  return targetDate.isAfter(currentDate, 'm');
};

const filter = {
  [FILTER_TYPE.EVERYTHING]: (events) => events,
  [FILTER_TYPE.FUTURE]: (events) => events.filter((event) => isDateFuture(event.dateTo)),
};

const isFormValid = (state) => {
  if (state.destination && state.basePrice) {
    const isDestination = DESTINATION_NAMES.includes(state.destination.name);
    return isDestination && /^\d+$/.test(state.basePrice);
  }
  return false;
};

export { isFormValid, filter, isDatesEqual, sortDays, sortPrices, getRandomInt, getRandomArrayElement, getDate, getTime, getFullDataTime };
