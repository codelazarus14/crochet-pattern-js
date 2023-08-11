const invalidColor = 'rgb(220, 0, 0)';

function renderListElement(listElement, elementData, htmlGenerator) {
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  listElement.innerHTML = html;
}

function setTitle(string) {
  document.title = string;
}

function generateOptionHTML(option, index, selected, disabled) {
  return `<option value="${option}"
  ${selected ? 'selected' : ''} 
  ${disabled ? 'disabled' : ''}>
  ${option}</option>`;
}

function generateDefaultSelectOption(chooseMsg) {
  // important = have to set value="undefined" or it won't work
  // https://stackoverflow.com/questions/52860383/default-option-of-select-is-not-showing
  return `<option value="undefined" 
  selected disabled hidden>${chooseMsg}</option>`;
}

// TODO: add image functionality

function generateImageUploadHTML(option, index) {
  return `<button class="image-attach">Upload Image?!?</button>`;
}

function generateImagePreview(image) {
  return 'Image';
}

function generateYarnImage() {
  return 'tiny';
}

function generateGlossaryImage() {
  return 'bigger';
}

function generateStepImage() {
  return 'click to open';
}