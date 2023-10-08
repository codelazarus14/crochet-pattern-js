export const addChar = '&#xff0b';
export const removeChar = '&#x1d5b7';
export const dragIcon = '&vellip;&vellip;';
export const clipboardIcon = '&#x1F4CB;';
export const checkmark = '&#x2713;';

export function sanitize(string) {
  // create DOMParser and split out text only
  const dom = new DOMParser().parseFromString(string, 'text/html');
  return dom.body.textContent;
}

// common button/select listeners

export function addSelectListener(element, updateFunc, funcArgs) {
  if (updateFunc) {
    element.addEventListener('change', () => {
      updateFunc.apply(null, funcArgs.concat([element.selectedIndex]));
    });
  }
}

const filterNumInput = (key) => {
  // allow numbers, inc/dec w arrows and delete
  return (isFinite(key) && key !== ' ') ||
    ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', 'Enter'].includes(key);
}

export function addNumInputListener(element, updateFunc, funcArgs) {
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

export function addDeleteListeners(listElem, itemList, updateFunc, requireConfirm, selector = '.js-delete-button') {
  listElem.querySelectorAll(selector)
    .forEach((deleteButton, index) => {
      addDeleteListener(deleteButton, index, itemList, updateFunc, requireConfirm);
    });
}

export function addDeleteListener(deleteButton, index, itemList, updateFunc, requireConfirm) {
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

export const resizeInput = (inputElem) => {
  inputElem.style.height = 0;
  inputElem.style.height = `${(inputElem.scrollHeight)}px`;
}

export function addInputResizeListener(inputElem) {
  inputElem.addEventListener('input', () =>
    resizeInput(inputElem));
}

export function addImageUploadListeners(listElem, itemList, updateFunc, allowMultiple) {
  listElem.querySelectorAll('.js-image-upload')
    .forEach((uploadElem, index) => {
      addImageUploadListener(uploadElem, itemList[index], updateFunc, allowMultiple);
    });
}

export function addImageUploadListener(element, item, updateFunc, allowMultiple) {
  element.innerHTML = generateImageUploadHTML();

  const uploadButton = element.querySelector('button');
  const uploadInput = element.querySelector('input');

  // make button trigger input elem
  uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    uploadInput.click();
  });

  uploadInput.addEventListener('change', () => {
    if (!uploadInput.files.length) return;

    if (!allowMultiple || !item.images) {
      item.images = [];
    }

    const uploadedFiles = allowMultiple ? uploadInput.files
      : [uploadInput.files[0]];

    for (const file of uploadedFiles) {
      const reader = new FileReader();
      // create data url for image
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e) => {
        const imageData = {
          dataUrl: e.target.result,
          info: {
            name: file.name,
            size: file.size
          }
        };
        item.images.push(imageData);
        updateFunc();
      });
    }
  });
}

function generateImageUploadHTML() {
  return `<button type="button" class="image-upload">Upload Image</button>
  <input class="hidden" type="file" accept="image/*" multiple>`;
}

export function addImageDisplayListeners(listElem, itemList, updateFunc) {
  listElem.querySelectorAll('[class$="image-display"]')
    .forEach((imageDisplay, index) => {
      addDeleteListeners(imageDisplay, itemList[index].images, updateFunc, false, '.js-delete-image');
    });
}