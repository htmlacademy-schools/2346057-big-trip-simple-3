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

export { updateItem, getRandomInt, getRandomArrayElement, getDate, getTime, getFullDataTime, createOnEscKeydownFunction };
