const addChar = '&#xff0b';
const removeChar = '&#x1d5b7';
const dragIcon = '&vellip;&vellip;';
const clipboardIcon = '&#x1F4CB;';
const checkmark = '&#x2713;';

function filterNumInput(key) {
  // allow numbers, inc/dec w arrows and delete
  return (isFinite(key) && key !== ' ') ||
    ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', 'Enter'].includes(key);
}

// TODO: sanitize inputs or escape generated HTML
function sanitize() {

}

// common button/select listeners

const updateListItem = (list, idx, value) => list[idx] = value;

function addSelectListeners(listName, itemList, idx) {
  // idx = index of property within each item
  document.querySelectorAll(listName)
    .forEach((updateInput, index) => {
      addSelectListener(updateInput, updateListItem, [itemList[index], idx]);
    });
}

function addSelectListener(element, updateFunc, funcArgs) {
  if (updateFunc) {
    element.addEventListener('change', () => {
      updateFunc.apply(null, funcArgs.concat([element.selectedIndex]));
    });
  }
}

function addNumInputListeners(listName, itemList, idx) {
  document.querySelectorAll(listName)
    .forEach((updateInput, index) => {
      addNumInputListener(updateInput, updateListItem, [itemList[index], idx]);
    });
}

function addNumInputListener(element, updateFunc, funcArgs) {
  element.addEventListener('keydown', event => {
    if (!filterNumInput(event.key))
      event.preventDefault();
  });
  if (updateFunc) {
    element.addEventListener('change', () => {
      updateFunc.apply(null, funcArgs.concat([Number(element.value)]));
    });
  }
}

function addDeleteListeners(listElem, itemList, updateFunc, requireConfirm) {
  listElem.querySelectorAll(`.js-delete-button`)
    .forEach((deleteButton, index) => {
      addDeleteListener(deleteButton, index, itemList, updateFunc, requireConfirm);
    });
}

function addDeleteListener(deleteButton, index, itemList, updateFunc, requireConfirm) {
  deleteButton.innerHTML = `<span class="delete-confirm js-delete-confirm hidden">Confirm</span>${removeChar}`;

  let confirming;
  const confirm = deleteButton.querySelector('.js-delete-confirm');

  deleteButton.addEventListener('click', () => {
    if (requireConfirm && !confirming) {
      confirm.classList.remove('hidden');
      confirming = true;
    } else {
      const removed = itemList.splice(index, 1)[0];
      updateFunc(index, removed);
    }
  });
  deleteButton.addEventListener('blur', () => {
    confirm.classList.add('hidden');
    confirming = false;
  });
}

// input resizing

function addInputResizeListener(inputElem) {
  inputElem.addEventListener('input', () =>
    resizeInput(inputElem));
}

function resizeInput(inputElem) {
  inputElem.style.height = 0;
  inputElem.style.height = `${(inputElem.scrollHeight)}px`;
}