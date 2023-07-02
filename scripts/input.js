function filterNumInput(key) {
  // allow numbers, inc/dec w arrows and delete
  return (isFinite(key) && key !== ' ') ||
    key === 'ArrowDown' || key === 'ArrowUp' ||
    key === "Backspace" || key === "Delete";
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

function addDeleteListeners(listName, itemList, renderFunc) {
  document.querySelectorAll(`.js-delete-${listName}-button`)
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        itemList.splice(index, 1);
        renderFunc();
      });
    });
}
