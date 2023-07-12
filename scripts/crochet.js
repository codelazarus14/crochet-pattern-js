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
// const hookListElement = document.querySelector('.js-hook-list');

const yarnFormElement = document.querySelector('.js-yarn-form');
const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnUnitsInputElement = document.querySelector('.js-yarn-units');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnConfirmInputElement = document.querySelector('.js-yarn-confirm');
const yarnListElement = document.querySelector('.js-yarn-list');

const glossaryFormElement = document.querySelector('.js-glossary-form');
const glossaryTermInputElement = document.querySelector('.js-term');
const glossaryDescInputElement = document.querySelector('.js-desc');
const glossaryConfirmInputElement = document.querySelector('.js-glossary-confirm');
const glossaryListElement = document.querySelector('.js-glossary-list');

const notesInputElement = document.querySelector('.js-notes-input');

// TODO: step inputs added as modular pieces supporting drag-and-drop/rearrange
const sectionGridElement = document.querySelector('.js-section-grid');
const sectionAddElement = document.querySelector('.js-add-section-button');

const submitElement = document.querySelector('.js-submit-button');
const resetElement = document.querySelector('.js-reset-button');

// unused - we seem to be using button visuals now
//
// const renderHookList = () => {
//   renderElement(hookListElement, selectedPattern.hooks, generateHookListHTML);
// }
const renderYarnList = () => {
  renderListElement(yarnListElement, selectedPattern.yarns, generateYarnListHTML);
  addDeleteListeners(yarnListElement, selectedPattern.yarns, renderYarnList);
  addNumInputListeners('.js-update-yarn-amt', selectedPattern.yarns, 1);
  addSelectListeners('.js-update-yarn-units', selectedPattern.yarns, 2);
}
const renderGlossary = () => {
  renderListElement(glossaryListElement, selectedPattern.glossary, generateGlossaryEntryHTML);
  addDeleteListeners(glossaryListElement, selectedPattern.glossary, renderGlossary);
}

const renderSectionHeading = (section, idx) => {
  section.querySelector('.js-section-heading')
    .innerHTML = generateSectionHeadingHTML(idx);
}
const renderSectionSteps = (section, idx) => {
  const stepListElement = section.querySelector('.js-steps-list');
  const rowInput = section.querySelector('.js-row-input');
  checkStepIndexes(idx);
  // only set value if step input is ready, so avoid 
  // nullref and wait for addStepInputListeners() to do it
  if (rowInput) 
    setRowInputValue(rowInput, idx);
  renderListElement(stepListElement, selectedPattern.steps[idx], generateStepHTML);
  addDeleteListeners(stepListElement, selectedPattern.steps[idx], renderSectionSteps, [section, idx]);
}
const renderSectionStepInput = (section, idx) => {
  section.querySelector('.js-step-form')
    .innerHTML = generateStepInputHTML();
  addStepInputListeners(section, idx);
}
const renderSectionGrid = () => {
  renderListElement(sectionGridElement, selectedPattern.steps, generateSectionHTML);
  const sections = sectionGridElement.querySelectorAll('.js-section');

  sections.forEach((section, index) => {
    if (sections.length > 1)
      renderSectionHeading(section, index);
    else
      section.querySelector('.js-section-heading').remove();
    renderSectionSteps(section, index);
    renderSectionStepInput(section, index);
  });
}

onload = () => {
  resetPage();
}

function resetPage() {
  // TODO: select not working on safari?
  renderPatternOptions();
  // clear all inputs
  document.querySelectorAll('input, textarea, .js-pattern-types').forEach(elem => elem.value = elem.defaultValue);
}

function setupCrochet() {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');

  // render input stuff once
  renderListElement(hookInputElement, Object.keys(USHookSizes), generateHookSizeButtonsHTML);
  addHookButtonListeners();

  renderListElement(yarnUnitsInputElement, yarnUnits, generateOptionHTML);
  addNumInputListener(yarnAmtInputElement);

  renderSectionGrid();

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

  sectionAddElement.addEventListener('click', () => {
    selectedPattern.steps.push([]);
    renderSectionGrid();
  });

  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelectorAll('input')
        .forEach(input => {
          if (!input.classList.contains('js-row-input'))
            input.value = input.defaultValue;
        });
    });
  });

  submitElement.addEventListener('click', () => {
    savedPatterns.push(selectedPattern);
    localStorage.setItem(PATTERN_KEY, JSON.stringify(savedPatterns));
  });

  resetElement.addEventListener('click', () => {
    location.reload();
  });
}

function populateCrochetPatternFields() {
  setupCrochet();
  renderYarnList();
  renderGlossary();
  notesInputElement.value = selectedPattern.notes;
  renderSectionGrid();
}

function addHookButtonListeners() {
  document.querySelectorAll('.js-hook-size-button')
    .forEach(button => {
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

function addStepInputListeners(section, idx) {
  const formElement = section.querySelector('.js-step-form');
  const rowInput = section.querySelector('.js-row-input');
  const instrInput = section.querySelector('.js-instr-input');

  setRowInputValue(rowInput, idx);

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

  formElement.addEventListener('submit', e => {
    e.preventDefault();
    const input = rowInput.value.trim();
    const currStep = Number(rowInput.dataset.currStep);
    const [startIdx, endIdx] = evaluateRowInput(input, currStep);
    const instr = instrInput.value.trim();
    if (selectedPattern.steps[idx])
      selectedPattern.steps[idx].push([startIdx, endIdx, instr, false]);
    else selectedPattern.steps[idx] = [[startIdx, endIdx, instr, false]];
    // TODO: remove/merge ambiguity with "forall submit forms clear fields" above?
    instrInput.value = instrInput.defaultValue;
    renderSectionSteps(section, idx);
  });
}

function setRowInputValue(rowInputElem, idx) {
  const sectionSteps = selectedPattern.steps[idx];

  // if section already exists, use final start/end idx
  const currStep =  sectionSteps.length > 0 ? 
    sectionSteps[sectionSteps.length - 1][1] || 
    sectionSteps[sectionSteps.length - 1][0] 
  : 0;
  rowInputElem.dataset.currStep = currStep;
  rowInputElem.value = currStep + 1;
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

function checkStepIndexes(sectionIdx) {
  const sectionSteps = selectedPattern.steps[sectionIdx];
  let foundError = sectionSteps[0] && sectionSteps[0][0] !== 1;

  for (let i = 0; i < sectionSteps.length; i++) {
    const prevStepEnd = sectionSteps[i][1] || sectionSteps[i][0];
    const nextStepStart = sectionSteps[i+1] && sectionSteps[i+1][0];

    // mark every step affected (after error)
    sectionSteps[i][3] = foundError;
    if (!foundError && nextStepStart) {
      // detect gap between rows
      foundError = nextStepStart !== prevStepEnd + 1;
    }
  }
}

function generateHookSizeButtonsHTML(option, index) {
  let classes = 'hook-size-button js-hook-size-button';
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
// TODO: add labels to all generated inputs

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
  <button class="js-delete-button">-</button></div>`;
}

function generateGlossaryEntryHTML(entry, index) {
  return `<div class="glossary-list-item">
  <div class="js-update-term-image">${generateImageUploadHTML()}</div>
  <div><span class="glossary-term">${entry[0]}</span></div>
  <div>${entry[1]}</div>
  <button class="js-delete-button">-</button></div>`;
}

function generateSectionHTML(section, idx) {
  return `<div class="section js-section" data-section-number="${idx}">
  <div class="section-heading js-section-heading"></div>
  <div class="step-list js-steps-list"></div>
  <form class="js-step-form"></form></div>`;
}

function generateSectionHeadingHTML(idx) {
  return `Section ${idx + 1}`;
}

function generateStepInputHTML() {
  const regex = '\\s*[0-9]+((?![,-])|(\\s*,\\s*|(\\s*-\\s*))\\s*[0-9]+)\\s*';
  return `<div class="step-input-grid">
  <div class="js-step-image">${generateImageUploadHTML()}</div>
  <input class="js-row-input row-input" placeholder="e.g. 1, 1-5" pattern="${regex}" required>
  <input class="js-instr-input" placeholder="Instructions for the first row" required>
  <button type="submit" class="js-step-confirm">+</button></div>`;
}

function generateStepHTML(step, index) {
  const rowString = 
    step[1] ? `Rows ${step[0]} - ${step[1]}` : `Row ${step[0]}`;
  const imageUpload = generateImageUploadHTML();
  const rowIndexError = step[3] ? 'step-index-error' : '';

  return `<div class="step-list-item">
  <div class="step-image">${imageUpload}</div>
  <div class="step-rows">
    <span class="${rowIndexError}">${rowString}</span></div>
  <div class="step-instrs">${step[2]}</div>
  <button class="js-delete-button">-</button></div>`;
}