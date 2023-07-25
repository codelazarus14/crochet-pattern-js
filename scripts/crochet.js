const hookInputElement = document.querySelector('.js-hook-types');

const yarnFormElement = document.querySelector('.js-yarn-form');
const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnUnitsInputElement = document.querySelector('.js-yarn-units');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnListElement = document.querySelector('.js-yarn-list');

const glossaryFormElement = document.querySelector('.js-glossary-form');
const glossaryTermInputElement = document.querySelector('.js-term');
const glossaryDescInputElement = document.querySelector('.js-desc');
const glossaryListElement = document.querySelector('.js-glossary-list');

const notesInputElement = document.querySelector('.js-notes-input');

// TODO: step inputs added as modular pieces supporting drag-and-drop/rearrange
const sectionGridElement = document.querySelector('.js-section-grid');
const sectionAddElement = document.querySelector('.js-add-section-button');

const saveElement = document.querySelector('.js-save-button');
const submitElement = document.querySelector('.js-submit-button');
const submitAlertElement = document.querySelector('.js-submit-alert');
const refreshElement = document.querySelector('.js-refresh-button');

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
  const sectionHeading = section.querySelector('.js-section-heading');
  sectionHeading.innerHTML = generateSectionHeadingHTML(idx);
  addSectionDeleteListener(sectionHeading, idx);
}
const renderSectionSteps = (section, idx) => {
  const stepListElement = section.querySelector('.js-steps-list');
  const rowInput = section.querySelector('.js-step-form .js-row-input');
  checkStepIndexes(idx);
  // only set value if step input is ready, so avoid 
  // nullref and wait for addStepInputListeners() to do it
  if (rowInput)
    setRowInputValue(rowInput, idx);
  renderListElement(stepListElement, selectedPattern.steps[idx], generateStepHTML);
  addDeleteListeners(stepListElement, selectedPattern.steps[idx], renderSectionSteps, [section, idx]);
  addRowInputListeners(stepListElement, section, idx);
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

let bodyRevealed;

onload = () => {
  resetPage();
}

function resetPage() {
  // TODO: select not working on safari?
  renderPatternOptions();
  // clear all inputs
  document.querySelectorAll('input, textarea, .js-pattern-types')
    .forEach(elem => elem.value = elem.defaultValue);
  document.querySelectorAll('textarea')
    .forEach(input => {
      resizeInput(input);
      addInputResizeListener(input);
    });
}

function setupCrochet() {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');
  document.querySelectorAll('textarea')
    .forEach(input => resizeInput(input));
  bodyRevealed = true;

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

  notesInputElement.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
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

  // TODO: save changes to things in pattern options form
  // (title, desc etc.) and display title on save button
  saveElement.addEventListener('click', e => {
    const result = validatePattern();
    if (result && typeof result === 'string') {
      e.preventDefault();
      submitAlertElement.innerHTML = result;
    } else {
      submitAlertElement.innerHTML = '';
      savePattern(selectedPattern, getLoadedPattern());
      location.reload();
    }
  });

  submitElement.addEventListener('click', e => {
    const result = validatePattern();
    if (result && typeof result === 'string') {
      e.preventDefault();
      submitAlertElement.innerHTML = result;
    } else {
      submitAlertElement.innerHTML = '';
      savePattern(selectedPattern);
    }
  });

  refreshElement.addEventListener('click', () => {
    location.reload();
  });
}

function populateCrochetPatternFields() {
  if (!bodyRevealed)
    setupCrochet();
  
  renderYarnList();
  renderGlossary();
  notesInputElement.value = selectedPattern.notes;
  renderSectionGrid();
  // TODO: refactor these three separate 'reset text area size' calls?
  document.querySelectorAll('textarea')
    .forEach(input => resizeInput(input));
}

function addHookButtonListeners() {
  document.querySelectorAll('.js-hook-size-button')
    .forEach(button => {
      button.addEventListener('click', () => {
        selectedPattern.hooks[button.value] =
          button.classList.toggle('selected');
        // renderHookList();
      });
    });
}

function addStepInputListeners(section, idx) {
  const formElement = section.querySelector('.js-step-form');
  const rowInput = formElement.querySelector('.js-row-input');
  const instrInput = formElement.querySelector('.js-instr-input');

  setRowInputValue(rowInput, idx);

  rowInput.addEventListener('input', () => {
    const input = rowInput.value.trim();
    const currStep = Number(rowInput.dataset.currStep);
    const result = parseRowInput(input, currStep);
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
    const [startIdx, endIdx] = parseRowInput(input, currStep);
    const instr = instrInput.value.trim();
    if (selectedPattern.steps[idx])
      selectedPattern.steps[idx].push([startIdx, endIdx, instr, false]);
    else selectedPattern.steps[idx] = [[startIdx, endIdx, instr, false]];
    // clear instr field
    instrInput.value = instrInput.defaultValue;
    renderSectionSteps(section, idx);
  });
}

function addRowInputListeners(stepListElem, section, index) {
  const stepList = selectedPattern.steps[index];

  stepListElem.querySelectorAll('.js-row-input')
    .forEach((rowInput, idx) => {
      rowInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          updateStepRows(rowInput, idx);
        }
      });
      rowInput.addEventListener('blur', () => {
        updateStepRows(rowInput, idx);
      });
    });

  function updateStepRows(rowInput, idx) {
    const input = rowInput.value.trim();
    const currStep = stepList[idx - 1] ?
      (stepList[idx - 1][1] ||
        stepList[idx - 1][0])
      : 0;
    const [start, end] = parseRowInput(input, currStep, true);
    stepList[idx][0] = start
    stepList[idx][1] = end;
    renderSectionSteps(section, index);
  }
}

function addSectionDeleteListener(section, index) {
  section.querySelector('.js-delete-button')
    .addEventListener('click', () => {
      selectedPattern.steps.splice(index, 1);
      renderSectionGrid();
    });
}

function setRowInputValue(rowInputElem, idx) {
  const sectionSteps = selectedPattern.steps[idx];

  // if section already exists, use final start/end idx
  const currStep = sectionSteps.length > 0 ?
    sectionSteps[sectionSteps.length - 1][1] ||
    sectionSteps[sectionSteps.length - 1][0]
    : 0;
  rowInputElem.dataset.currStep = currStep;
  rowInputElem.value = currStep + 1;
}

function parseRowInput(rowsInput, currStep, skipIdxCheck) {
  let start, end;

  const separatorIdx = Math.max(rowsInput.indexOf(','), rowsInput.indexOf('-'));
  // row 1 vs. rows [1,3]
  if (separatorIdx < 0) {
    start = Number(rowsInput);
  } else {
    start = Number(rowsInput.slice(0, separatorIdx));
    end = Number(rowsInput.slice(separatorIdx + 1));
  }
  if (!skipIdxCheck) {
    if (start !== currStep + 1) {
      return 'Please start on the next row.';
    }
    if (end && end < start) {
      return 'Row starting index must be less than end.';
    }
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
    const nextStepStart = sectionSteps[i + 1] && sectionSteps[i + 1][0];

    // mark every step affected (after error)
    sectionSteps[i][3] = foundError;
    if (!foundError && nextStepStart) {
      // detect gap between rows
      foundError = nextStepStart !== prevStepEnd + 1;
    }
  }
}

function validatePattern() {
  const emptySections = [];
  let result;

  selectedPattern.steps.forEach((section, index) => {
    if (section[0] === undefined)
      emptySections.push(index + 1);
  });

  if (emptySections.length) {
    if (emptySections.length === selectedPattern.steps.length) {
      result = 'Pattern must include at least one step.';
    } else {
      result = (emptySections.length > 1 ? 'Sections' : 'Section') + ` ${emptySections} must include at least one step.`;
    }
  }
  return result;
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
// TODO: add tooltips for yarns and glossary entries

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
  <a class="js-delete-button">${removeChar}</a></div>`;
}

function generateGlossaryEntryHTML(entry, index) {
  return `<div class="glossary-list-item">
  <div class="js-update-term-image">${generateImageUploadHTML()}</div>
  <div><span class="glossary-term">${entry[0]}</span></div>
  <div>${entry[1]}</div>
  <a class="js-delete-button">${removeChar}</a></div>`;
}

function generateSectionHTML(section, idx) {
  return `<div class="section js-section" data-section-number="${idx}">
  <div class="section-heading js-section-heading"></div>
  <div class="step-list js-steps-list"></div>
  <form class="js-step-form"></form></div>`;
}

function generateSectionHeadingHTML(idx) {
  // TODO: add 'are you sure?' prompt to avoid accidentally
  // deleting sections
  return `<div>Section ${idx + 1}</div>
  <a class="js-delete-button">${removeChar}</a>`;
}

function generateStepInputHTML() {
  const regex = '\\s*[0-9]+((?![,-])|(\\s*,\\s*|(\\s*-\\s*))\\s*[0-9]+)\\s*';

  return `<div class="step-input-grid">
  <div class="js-step-image">${generateImageUploadHTML()}</div>
  <input class="js-row-input row-input" placeholder="e.g. 1, 1-5" pattern="${regex}" required>
  <input class="js-instr-input" placeholder="Enter instructions" required>
  <button type="submit" class="step-confirm-button">${addChar}</button></div>`;
}

function generateStepHTML(step, index) {
  const rowPrefix =
    step[1] ? 'Rows' : 'Row';
  const rowValue =
    step[1] ? `${step[0]} - ${step[1]}` : `${step[0]}`;
  const imageUpload = generateImageUploadHTML();
  const rowIndexError = step[3] ? '' : 'is-hidden';
  const regex = '\\s*[0-9]+((?![,-])|(\\s*,\\s*|(\\s*-\\s*))\\s*[0-9]+)\\s*';

  return `<div class="step-list-item">
  <div class="step-image">${imageUpload}</div>
  <div class="step-rows">
    <div class="step-rows-input">${rowPrefix}
      <input class="js-row-input row-input" placeholder="e.g. 1, 1-5" pattern="${regex}" value="${rowValue}" required></div>
    <span class="row-index-error ${rowIndexError}">Index error</span></div>
  <div class="step-instrs">${step[2]}</div>
  <a class="js-delete-button">${removeChar}</a></div>`;
}