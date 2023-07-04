const USHookSizes = {
  B: 2.25,
  C: 2.75,
  D: 3.25,
  E: 3.50,
  F: 3.75,
  G: 4.00,
  H: 5.00,
  I: 5.50,
  J: 6.00,
  K: 6.50
}

const yarnUnits = [Units.meters, Units.yards, Units.skeins];

const hookInputElement = document.querySelector('.js-hook-types');
const hookListElement = document.querySelector('.js-hook-list');

const yarnFormElement = document.querySelector('.js-yarn-form');
const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnUnitsInputElement = document.querySelector('.js-yarn-units');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnConfirmInputElement = document.querySelector('.js-yarn-confirm');
const yarnListElement = document.querySelector('.js-yarn-list');

const glossaryFormElement = document.querySelector('.js-glossary-form');
const glossaryTermInputElement = document.querySelector('.js-term-input');
const glossaryDescInputElement = document.querySelector('.js-desc-input');
const glossaryConfirmInputElement = document.querySelector('.js-glossary-confirm');
const glossaryListElement = document.querySelector('.js-glossary-list');

const notesInputElement = document.querySelector('.js-notes-input');

// TODO: step inputs added as modular pieces on top of each other
// supporting drag-and-drop/rearrange
let headSectionElement = document.querySelector('.js-section')
const sectionAddElement = document.querySelector('.js-add-section');

const submitElement = document.querySelector('.js-submit-button');
const resultElement = document.querySelector('.js-result');

// unused - we seem to be using button visuals now
//
// const renderHookList = () => {
//   renderElement(hookListElement, selectedPattern.hooks, generateHookListHTML);
// }
const renderYarnList = () => {
  renderElement(yarnListElement, selectedPattern.yarns, generateYarnListHTML);
  addDeleteListeners('yarn', selectedPattern.yarns, renderYarnList);
  addNumInputListeners('.js-update-yarn-amt', selectedPattern.yarns, 1);
  addSelectListeners('.js-update-yarn-units', selectedPattern.yarns, 2);
}
const renderGlossary = () => {
  renderElement(glossaryListElement, selectedPattern.glossary, generateGlossaryEntryHTML);
  addDeleteListeners('term', selectedPattern.glossary, renderGlossary);
}
const renderSteps = (idx) => {
  // TODO: fix broken delete listeners argh
  const stepListElement = document.querySelector(`[data-section-number="${idx}"] .js-steps-list`);
  renderElement(stepListElement, selectedPattern.steps[idx], generateStepHTML);
  addDeleteListeners('step', selectedPattern.steps[idx], renderSteps, idx);
}

// clear all inputs
onload = () => {
  renderPatternOptions();
  document.querySelectorAll('input, .js-pattern-types').forEach(elem => elem.value = elem.defaultValue);
}

function setupCrochet() {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');
  
  // render input stuff once
  renderElement(hookInputElement, Object.keys(USHookSizes), generateHookSizeButtonsHTML);
  addHookButtonListeners();

  renderElement(yarnUnitsInputElement, yarnUnits, generateOptionHTML);
  addNumInputListener(yarnAmtInputElement);

  yarnFormElement.addEventListener('submit', () => {
    const yarnName = yarnNameInputElement.value.trim();
    const yarnAmt = Number(yarnAmtInputElement.value);
    const yarnUnitsIdx = yarnUnitsInputElement.selectedIndex;
    selectedPattern.yarns.push([yarnName, yarnAmt, yarnUnitsIdx]);
    renderYarnList();
  });

  glossaryFormElement.addEventListener('submit', () => {
    const newTerm = glossaryTermInputElement.value.trim();
    const newDesc = glossaryDescInputElement.value.trim();
    selectedPattern.glossary.push([newTerm, newDesc]);
    renderGlossary();
  });

  notesInputElement.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      selectedPattern.notes = notesInputElement.value.trim();
      console.log(selectedPattern);
    }
  });

  addStepSectionListeners(headSectionElement);
  sectionAddElement.addEventListener('click', () => {
    const oldHeading = headSectionElement.querySelector('.js-section-heading');
    oldHeading.classList.remove('is-hidden');

    const newSection = headSectionElement.cloneNode(true);
    const newHeading = newSection.querySelector('.js-section-heading');
    const newList = newSection.querySelector('.js-steps-list');

    const oldNum = Number(headSectionElement.dataset.sectionNumber);
    newSection.dataset.sectionNumber = oldNum + 1;
    newHeading.innerHTML = `Section ${Number(newSection.dataset.sectionNumber) + 1}`;
    // clear deep-copied list items
    while (newList.firstChild) newList.removeChild(newList.firstChild);

    headSectionElement.after(newSection);
    addStepSectionListeners(newSection);
    headSectionElement = newSection;
  });

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      form.querySelectorAll('input')
        .forEach(input => {
          if (!input.classList.contains('js-row-input'))
            input.value = input.defaultValue;
        });
    });
  });

  submitElement.addEventListener('click', () => {
    resultElement.innerHTML = JSON.stringify(selectedPattern);
  });
}

function addHookButtonListeners() {
  document.querySelectorAll('.js-hook-size-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        if (button.classList.contains('selected')) {
          selectedPattern.hooks[button.value] = false;
          button.classList.remove('selected');
        } else {
          selectedPattern.hooks[button.value] = true;
          button.classList.add('selected');
        }
        // renderHookList();
      });
    });
}

function addStepSectionListeners(section) {
  const sectionNum = section.dataset.sectionNumber;
  const formElement = section.querySelector('.js-step-form');
  const rowInput = section.querySelector('.js-row-input');
  const instrInput = section.querySelector('.js-instr-input');

  // initial values 
  rowInput.dataset.currStep = 0;
  rowInput.value = 1;

  rowInput.addEventListener('input', () => {
    const input = rowInput.value.trim();
    const currStep = Number(rowInput.dataset.currStep);
    const result = evaluateRowInput(input, currStep);
    // turn errmsg into invalid form entry
    if (typeof result === 'string')
      rowInput.setCustomValidity(result);
    else
      rowInput.setCustomValidity('');
  });

  formElement.addEventListener('submit', () => {
    const input = rowInput.value.trim();
    const currStep = Number(rowInput.dataset.currStep);
    const [startIdx, endIdx] = evaluateRowInput(input, currStep);
    const instr = instrInput.value.trim();
    if (selectedPattern.steps[sectionNum])
      selectedPattern.steps[sectionNum].push([startIdx, endIdx, instr]);
    else selectedPattern.steps[sectionNum] = [[startIdx, endIdx, instr]];
    rowInput.dataset.currStep = endIdx || startIdx;
    rowInput.value = Number(rowInput.dataset.currStep) + 1;
    // TODO: remove/merge ambiguity with "forall submit forms clear fields" above?
    instrInput.value = instrInput.defaultValue;
    renderSteps(sectionNum);
  });
}

function evaluateRowInput(rowsInput, currStep) {
  let start, end;

  const separatorIdx = Math.max(rowsInput.indexOf(','), rowsInput.indexOf('-'));
  // row 1 vs. rows [1,3]
  if (separatorIdx < 0) {
    start = Number(rowsInput);
  } else {
    start = Number(rowsInput.slice(0, separatorIdx));
    end = Number(rowsInput.slice(separatorIdx + 1));
  }
  if (start !== currStep + 1) {
    return 'Please start on the next row.';
  }
  if (end && end < start) {
    return 'Row starting index must be less than end.';
  }
  if (start === end)
    end = undefined;

  return [start, end];
}

function generateHookSizeButtonsHTML(option, index) {
  let classes = 'js-hook-size-button';
  if (selectedPattern.hooks[index])
    classes += ' selected';
  return `<button class="${classes}" value="${index}">${option}/${USHookSizes[option]}</button>`;
}

// function generateHookListHTML(selected, index) {
//   if (!selected) return '';
//   return `<div>US 
//   ${Object.keys(USHookSizes)[index]} /
//   ${Object.values(USHookSizes)[index]}</div>`
// }

// TODO: make output list items have editable text fields

// TODO: make scrollbars once lists get too big

function generateYarnListHTML(yarn, index) {
  let units = '';
  yarnUnits.forEach((unit, idx) => {
    units += generateOptionHTML(unit, 1, idx === yarn[2]);
  });
  const imageUpload = generateImageUploadHTML();

  return `<div class="yarn-list-item">
  <div class="js-update-yarn-image">${imageUpload}</div>
  <div>${yarn[0]}</div>
  <input class="js-update-yarn-amt" type="number" value="${yarn[1]}" min="1">
  <select class="js-update-yarn-units">${units}</select>
  <button class="js-delete-yarn-button">-</button></div>`;
}

function generateGlossaryEntryHTML(entry, index) {
  return `<div class="glossary-list-item">
  <div class="js-update-term-image">${generateImageUploadHTML()}</div>
  <div><span class="glossary-term">${entry[0]}</span></div>
  <div>${entry[1]}</div>
  <button class="js-delete-term-button">-</button></div>`;
}

function generateStepHTML(step, index) {
  const rowString = step[1] ? `Rows ${step[0]} - ${step[1]}` : `Row ${step[0]}`;
  const imageUpload = generateImageUploadHTML();

  return `<div class="step-list-item">
  <div class="step-image">${imageUpload}</div>
  <div class="step-rows">${rowString}</div>
  <div class="step-instrs">${step[2]}</div>
  <button class="js-delete-step-button">-</button></div>`;
}