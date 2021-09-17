import { Place } from '../const.js';

import AbstractView from '../views/abstract-view.js';

export const render = (container, element, place = Place.BEFORE_END) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case Place.BEFORE_END:
      container.append(element);
      break;
    case Place.AFTER_BEGIN:
      container.prepend(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const rerender = (newElement, oldElement, container, place = Place.BEFORE_END) => {
  if (oldElement) {
    replace(newElement, oldElement);
  } else {
    render(container, newElement, place);
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
