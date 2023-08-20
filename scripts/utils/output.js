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

// TODO: add image functionality

export function generateImageUploadHTML(option, index) {
  return `<button class="image-attach">Upload Image?!?</button>`;
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