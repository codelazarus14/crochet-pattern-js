export const invalidColor = 'rgb(220, 0, 0)';

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
  // important = have to set value="undefined" or it won't work
  // https://stackoverflow.com/questions/52860383/default-option-of-select-is-not-showing
  return `<option value="undefined" 
  selected disabled hidden>${chooseMsg}</option>`;
}

export const ImageStyles = {
  Preview: 'Preview',
  Mini: 'Mini',
  Bigger: 'Bigger',
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
  let imageClass = '';

  switch (style) {
    case ImageStyles.Preview:
      imageClass = 'image-preview';
      break;
  }

  return `<div class="${imageClass}" data-img-index="${index}">
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