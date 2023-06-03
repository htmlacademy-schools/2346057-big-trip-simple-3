import dayjs from 'dayjs';

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

const isEscapeKey = (evt) => evt.key === 'Escape';

const createOnEscKeydownFunction = (element, onKeydownFunction) => {
  const onEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      onKeydownFunction();
    }
  };
  element.addEventListener('keydown', onEscKeydown);

  return onEscKeydown;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

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

const sortDays = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateTo, taskB.dateTo);

  return weight ?? dayjs(taskA.dateTo).diff(dayjs(taskB.dateTo));
};

const sortPrices = (taskA, taskB) => taskB.basePrice - taskA.basePrice;

export { sortDays, sortPrices, updateItem, getRandomInt, getRandomArrayElement, getDate, getTime, getFullDataTime, createOnEscKeydownFunction };

