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

const sectionGridElement = document.querySelector('.js-section-grid');
const sectionAddElement = document.querySelector('.js-add-section-button');

const renderHookSizeButtons = () => {
  renderListElement(hookInputElement, Object.keys(USHookSizes), generateHookSizeButtonsHTML);
  addHookButtonListeners();
}

const renderYarnList = () => {
  renderListElement(yarnListElement, selectedPattern.yarns, generateYarnListHTML);
  addDeleteListeners(yarnListElement, selectedPattern.yarns, (delIdx) => renderYarnList());
  addNumInputListeners('.js-update-yarn-amt', selectedPattern.yarns, 1);
  addSelectListeners('.js-update-yarn-units', selectedPattern.yarns, 2);
}
const renderGlossary = () => {
  renderListElement(glossaryListElement, selectedPattern.glossary, generateGlossaryEntryHTML);
  addDeleteListeners(glossaryListElement, selectedPattern.glossary, (delIdx) => renderGlossary());
}

const renderSectionHeading = (section, idx) => {
  const sectionHeading = section.querySelector('.js-section-heading');
  const startDropZone = section.querySelector('.js-step-dropzone');
  sectionHeading.innerHTML = generateSectionHeadingHTML(idx);
  addSectionDeleteListener(sectionHeading, idx);
  addStepDropListener(startDropZone, selectedPattern.steps[idx], idx);
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
  addDeleteListeners(stepListElement, selectedPattern.steps[idx], (delIdx) => renderSectionSteps(section, idx));
  addRowInputListeners(stepListElement, section, idx);
  addDragNDropListeners(stepListElement, section, idx);
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
  addPatternSubmitListeners();
  // clear all inputs
  document.querySelectorAll('input, textarea, .js-pattern-types')
    .forEach(elem => elem.value = elem.defaultValue);
  // reset size of pattern options text boxes
  // TODO: refactor the three separate 'reset textarea 
  // size' calls for each section ?
  document.querySelectorAll('textarea')
    .forEach(input => {
      resizeInput(input);
      addInputResizeListener(input);
    });
}

function setupCrochet() {
  document.querySelector('.js-pattern-body').classList.remove('hidden');
  // reset size of pattern body text boxes (notes)
  document.querySelectorAll('textarea')
    .forEach(input => resizeInput(input));
  bodyRevealed = true;

  // render input stuff once
  renderHookSizeButtons();
  renderListElement(yarnUnitsInputElement, yarnUnitNames, generateOptionHTML);
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

  notesInputElement.addEventListener('blur', e => {
    selectedPattern.notes = notesInputElement.value.trim();
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
}

function populateCrochetPatternFields() {
  if (!bodyRevealed)
    setupCrochet();

  renderHookSizeButtons();
  renderYarnList();
  renderGlossary();
  notesInputElement.value = selectedPattern.notes;
  renderSectionGrid();
  // since we skipped setup, have to resize text boxes
  // (notes box) to fit their content
  document.querySelectorAll('textarea')
    .forEach(input => resizeInput(input));
}

function addHookButtonListeners() {
  document.querySelectorAll('.js-hook-size-button')
    .forEach(button => {
      button.addEventListener('click', () => {
        selectedPattern.hooks[button.value] =
          !selectedPattern.hooks[button.value];
        renderHookSizeButtons();
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
  const deleteButton = section.querySelector('.js-delete-button');

  addDeleteListener(deleteButton, index, selectedPattern.steps, () => renderSectionGrid(), true);
}

function addDragNDropListeners(listElem, section, idx) {
  const sectionSteps = selectedPattern.steps[idx];
  listElem.querySelectorAll('.js-drag-icon')
    .forEach((dragger, index) => {
      addStepDragListener(dragger, index, sectionSteps, idx);
    });
  listElem.querySelectorAll('.js-step-dropzone')
    .forEach(dropZone => {
      addStepDropListener(dropZone);
    });
}

function addStepDragListener(dragger, idx, sectionSteps, secIdx) {
  const step = dragger.parentElement;
  // make whole step drag instead of child icon
  dragger.addEventListener('mousedown', () => {
    step.setAttribute('draggable', 'true');
  });
  dragger.addEventListener('mouseout', () => {
    step.setAttribute('draggable', 'false');
  });
  // mark dragged step
  step.addEventListener('dragstart', e => {
    const stepData = JSON.stringify([[secIdx, idx], sectionSteps[idx]]);
    e.dataTransfer.setData('text/plain', stepData);
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  });
  step.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
  });
}

function addStepDropListener(dropZone) {
  // style dragged-over dropzones
  dropZone.addEventListener('dragenter', e => {
    if (checkDropZone(dropZone)) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }
  });
  dropZone.addEventListener('dragover', e => {
    if (checkDropZone(dropZone)) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }
  });
  // clear style after dragging elsewhere
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', e => {
    dropZone.classList.remove('drag-over');
    handleDrop(e);
  });

  function checkDropZone(dropZone) {
    const draggingStep = sectionGridElement.querySelector('.dragging');
    // prevent dropping onto itself (parent wrapper) 
    // or "start" of list if dragging first step
    // or "between" dropzone of previous
    // aka anything that wouldn't alter the list
    const betweenZone = dropZone.classList.contains('step-between');
    const startZone = dropZone.classList.contains('step-start');
    const sameSection =
      dropZone.closest('.js-section').dataset.sectionIdx ===
      draggingStep.closest('.js-section').dataset.sectionIdx;
    const firstStep = !(Number(draggingStep.parentElement.dataset.stepIdx));
    const prevStep =
      Number(dropZone.parentElement.dataset.stepIdx) + 1 ===
      Number(draggingStep.parentElement.dataset.stepIdx);

    return dropZone.parentElement !== draggingStep.parentElement &&
      !(betweenZone && sameSection && prevStep) &&
      !(startZone && sameSection && firstStep);
  }

  function handleDrop(e) {
    // get step to insert
    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const draggedSection = Number(dragData[0][0]);
    const draggedIdx = Number(dragData[0][1]);
    const draggedStep = dragData[1];
    // get target step
    const targetStart = e.target.classList.contains('step-start');
    const targetSection =
      Number(e.target.closest('.js-section').dataset.sectionIdx);
    const targetIdx = !targetStart ?
      Number(e.target.closest('.js-step-wrapper').dataset.stepIdx)
      : 0;

    console.log(e.target.classList);

    if (e.target.classList.contains('step-start') ||
      e.target.classList.contains('step-between')) {
      // move dragged step to beginning or after targeted step 
      const insIdx = targetStart ? 0 : targetIdx + 1;
      const delIdx =
        // increment if step is lower in the same section
        targetSection === draggedSection && draggedIdx > targetIdx ?
          draggedIdx + 1 : draggedIdx;

      selectedPattern.steps[targetSection].splice(insIdx, 0, draggedStep);
      selectedPattern.steps[draggedSection].splice(delIdx, 1);
    } else if (e.target.closest('.js-step-list-item')) {
      // swap targeted step and dragged
      const targetStep = selectedPattern.steps[targetSection][targetIdx];
      const temp = structuredClone(targetStep);

      selectedPattern.steps[targetSection][targetIdx] = draggedStep;
      selectedPattern.steps[draggedSection][draggedIdx] = temp;
    } else {
      console.error('Drop zone behavior not specified!');
    }

    // render updated steps
    if (targetSection === draggedSection) {
      renderSectionSteps(e.target.closest('.js-section'),
        targetSection);
    } else {
      renderSectionGrid();
    }
  }
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
// TODO: add tooltips for yarns and glossary entries

function generateYarnListHTML(yarn, index) {
  let units = '';
  yarnUnitNames.forEach((unit, idx) => {
    units += generateOptionHTML(unit, 1, idx === yarn[2]);
  });
  const imageUpload = generateImageUploadHTML();

  return `<div class="yarn-list-item">
  <div class="js-update-yarn-image">${imageUpload}</div>
  <label class="yarn-name">Name:
    <span>${yarn[0]}</span></label>
  <label class="yarn-amt">Amount:
    <input class="update-yarn-amt js-update-yarn-amt" type="number" value="${yarn[1]}" min="1"></label>
  <label class="yarn-units">Units:
    <select class="update-yarn-units js-update-yarn-units">${units}</select></label>
  <button class="js-delete-button"></button></div>`;
}

function generateGlossaryEntryHTML(entry, index) {
  return `<div class="glossary-list-item">
  <div class="js-update-term-image">${generateImageUploadHTML()}</div>
  <label>Term:
    <span class="glossary-term">${entry[0]}</span></label>
  <label>Description:
    <span class="glossary-desc">${entry[1]}</span></label>
  <button class="js-delete-button"></button></div>`;
}

function generateSectionHTML(section, idx) {
  return `<div class="section js-section" data-section-idx="${idx}">
  <div class="section-heading js-section-heading"></div>
  <div class="step-start js-step-dropzone"></div>
  <div class="step-list js-steps-list"></div>
  <form class="step-form js-step-form"></form></div>`;
}

function generateSectionHeadingHTML(idx) {
  return `<div>Section ${idx + 1}</div>
  <button class="js-delete-button"></button>`;
}

function generateStepInputHTML() {
  const regex = '\\s*[0-9]+((?![,-])|(\\s*,\\s*|(\\s*-\\s*))\\s*[0-9]+)\\s*';

  return `<div class="step-input-grid">
  <div class="js-step-image">${generateImageUploadHTML()}</div>
  <label class="step-rows-input">Rows:
    <input class="js-row-input row-input" placeholder="e.g. 1, 1-5" pattern="${regex}" required></label>
  <label class"step-instr-input">Instructions:
    <input class="js-instr-input" placeholder="Enter instructions" required></label>
  <button type="submit" class="step-confirm-button">${addChar}</button></div>`;
}

function generateStepHTML(step, index) {
  const rowPrefix =
    step[1] ? 'Rows' : 'Row';
  const rowValue =
    step[1] ? `${step[0]} - ${step[1]}` : `${step[0]}`;
  const imageUpload = generateImageUploadHTML();
  const rowIndexError = step[3] ? '' : 'hidden';
  const regex = '\\s*[0-9]+((?![,-])|(\\s*,\\s*|(\\s*-\\s*))\\s*[0-9]+)\\s*';

  return `<div class="step-wrapper js-step-wrapper" data-step-idx="${index}">
  <div class="js-step-list-item step-list-item js-step-dropzone">
    <div aria-hidden="true" class="drag-icon js-drag-icon no-highlight">${dragIcon}</div>
    <div class="step-image">${imageUpload}</div>
    <div class="step-rows">
      <label class="step-rows-input">${rowPrefix}
        <input class="js-row-input row-input" placeholder="e.g. 1, 1-5" pattern="${regex}" value="${rowValue}" required></label>
      <div class="row-index-error ${rowIndexError}">Index error</div></div>
    <div class="step-instrs">${step[2]}</div>
    <button class="js-delete-button"></button></div>
  <div class="step-between js-step-dropzone"></div></div>`;
}