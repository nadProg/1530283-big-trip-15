import { KeyCode } from '../const.js';

export const isEsc = ({ code }) => code === KeyCode.ESCAPE;

// export const isEnter = ({ code }) => code === KeyCode.ENTER;

export const isOnline = () => window.navigator.onLine;

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};
