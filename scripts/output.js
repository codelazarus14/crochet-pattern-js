function renderElement(element, elementData, htmlGenerator) {
  console.log(selectedPattern);
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  element.innerHTML = html;
}

function generateOptionHTML(option, index, selected) {
  return `<option value="${option}" 
    ${selected ? 'selected' : ''}>${option}</option>`;
}