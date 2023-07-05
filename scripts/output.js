function renderListElement(listElement, elementData, htmlGenerator) {
  console.log(selectedPattern);
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  listElement.innerHTML = html;
}

function generateOptionHTML(option, index, selected) {
  return `<option value="${option}" 
    ${selected ? 'selected' : ''}>${option}</option>`;
}

function generateImageUploadHTML(option, index) {
  return `<button class="image-attach">Upload Image?!?</button>`;
}