function renderListElement(listElement, elementData, htmlGenerator) {
  console.log(selectedPattern);
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  listElement.innerHTML = html;
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

function generateImageUploadHTML(option, index) {
  return `<button class="image-attach">Upload Image?!?</button>`;
}