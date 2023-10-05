export function renderListElement(listElement, elementData, htmlGenerator) {
  let html = '';

  // every bit of rendering code that uses this function
  // at least once, if not everywhere, should have at least
  // these two arguments even if unused
  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  listElement.innerHTML = html;
}

export function setTitle(string) {
  document.title = string;
}

export function generateOptionHTML(option, index, selected, disabled) {
  return `<option value="${option}"
  ${selected ? 'selected' : ''} 
  ${disabled ? 'disabled' : ''}>
  ${option}</option>`;
}

export function generateDefaultSelectOption(chooseMsg) {
  // https://stackoverflow.com/questions/52860383/default-option-of-select-is-not-showing
  return `<option disabled selected hidden value=undefined>${chooseMsg}</option>`;
}

export function renderError(e, errorElem, hideElems) {
  hideElems.forEach(elem => elem.classList.add('hidden'));
  errorElem.innerHTML = e;
  errorElem.classList.add('error-display');
}

export const ImageStyles = {
  Preview: 'image-preview',
  Mini: 'image-mini',
  Bigger: 'image-bigger',
};

export function renderImageDisplay(images, style, deleteable) {
  let html = '';
  images.forEach((image, index) => {
    html += renderImage(image, index, style, deleteable);
  });
  return html;
}

export function renderImage(image, index, style, deleteable) {
  const { dataUrl, info } = image;
  const deleteButton = deleteable ?
    '<div class="delete-image js-delete-image">X</div>' : '';

  return `<div class="${style}" data-img-index="${index}">
    <img src="${dataUrl}" id="${info.name}">
    ${deleteButton}</div>`;
}

export function generateImagePreview(image) {
  return 'Image';
}

export function generateYarnImage() {
  return 'tiny';
}

export function generateGlossaryImage() {
  return 'bigger';
}

export function generateStepImage() {
  return 'click to open';
}