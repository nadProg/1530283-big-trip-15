import { KeyCode } from '../const.js';

export const isEsc = ({ code }) => code === KeyCode.ESCAPE;

export const isEnter = ({ code }) => code === KeyCode.ENTER;

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

export const enableForm = (form) => {
  Array.from(form.elements).forEach((element) => {
    element.disabled = false;
  });
};

export const disableForm = (form) => {
  Array.from(form.elements).forEach((element) => {
    element.disabled = true;
  });
};

export const moveCursorToEnd = (element) => {
  if (typeof element.selectionStart === 'number') {
    element.selectionStart = element.selectionEnd = element.value.length;
  } else if (typeof element.createTextRange !== 'undefined') {
    element.focus();
    const range = element.createTextRange();
    range.collapse(false);
    range.select();
  }
};
