import {
  PatternTypes,
  selectedPattern,
  setSelectedPattern,
  yarnUnitNames
} from "../data/pattern-types.js";
import {
  getInProgressKey,
  loadAllPatterns,
  saveInProgressKey,
  savePatternProgress,
  savedPatterns,
  setupDB
} from "../data/persistence.js";
import {
  renderPatternList,
  setLoadedPattern
} from "../pages-shared/pattern-list.js";
import {
  addPopupListeners
} from "../pages-shared/popups/popup.js";
import {
  addNumInputListener,
  checkmark
} from "../utils/input.js";
import {
  generateGlossaryImage,
  generateStepImage,
  generateYarnImage,
  renderListElement,
  setTitle,
  ImageStyles,
  renderImageDisplay,
  renderError
} from "../utils/output.js";


let patternKey, patternProgress;

const materialsListElem = document.querySelector('.js-materials-list');
const glossaryListElem = document.querySelector('.js-glossary-list');
const stepsListElem = document.querySelector('.js-steps-list');
const sectionCounterElem = document.querySelector('.section-counter .js-counter');
const rowCounterElem = document.querySelector('.row-counter .js-counter');
const saveStatusElem = document.querySelector('.js-save-status');

const renderBasicInfoMini = () => {
  document.querySelector('.js-pattern-title').innerHTML =
    selectedPattern.title;
  document.querySelector('.js-pattern-author').innerHTML =
    selectedPattern.author;
  document.querySelector('.js-pattern-desc').innerHTML =
    selectedPattern.desc;
}

const renderCounters = () => {
  const { sectionCount, rowCount } = patternProgress;
  sectionCounterElem.value = sectionCount;
  rowCounterElem.value = rowCount;
  if (selectedPattern.steps.length === 1)
    sectionCounterElem.parentElement.classList.add('hidden');
  else
    sectionCounterElem.parentElement.classList.remove('hidden');
}

const renderHooksMini = () => {
  let hookListElem = document.querySelector('.js-hooks-mini');
  if (!hookListElem) {
    hookListElem = document.createElement('div');
    hookListElem.setAttribute('class', 'hooks-mini js-hooks-mini');
    materialsListElem.appendChild(hookListElem);
  }
  renderListElement(hookListElem, selectedPattern.hooks.values, generateHookMini);
}

const renderYarnsMini = () => {
  let yarnListElem = document.querySelector('.js-yarns-mini');
  if (!yarnListElem) {
    yarnListElem = document.createElement('div');
    yarnListElem.setAttribute('class', 'yarns-mini js-yarns-mini');
    materialsListElem.appendChild(yarnListElem);
  }
  renderListElement(yarnListElem, selectedPattern.yarns, generateYarnMini);
}

const renderGlossaryMini = () => {
  renderListElement(glossaryListElem, selectedPattern.glossary, generateGlossaryMini);
}

const renderNotesMini = () => {
  document.querySelector('.js-pattern-notes').innerHTML =
    selectedPattern.notes.text;
}

const renderSteps = () => {
  const section = patternProgress.sectionCount - 1;
  const row = patternProgress.rowCount;
  renderListElement(stepsListElem, selectedPattern.steps[section], generateStepInUse);
  const lastStep = stepsListElem.lastChild;
  // add padding below final step
  lastStep.style.marginBottom =
    `${stepsListElem.clientHeight - (3 * lastStep.scrollHeight) / 4}px`;

  // auto-scrolling
  const focusedIdx = selectedPattern.steps[section]
    .findIndex((step, idx) => {
      const nextStep = selectedPattern.steps[section][idx + 1];
      return step.start <= row && (nextStep ? row < nextStep.start : true);
    });

  const stepElem = stepsListElem.querySelector(`[data-step-idx="${focusedIdx}"]`);
  stepElem.scrollIntoView({ behavior: 'smooth' });
}

const renderPatternInProgress = () => {
  renderBasicInfoMini();
  renderCounters();

  switch (selectedPattern.type) {
    case PatternTypes.USCrochet:
      renderHooksMini();
      renderYarnsMini();
      renderGlossaryMini();
      renderNotesMini();
      renderSteps();
      break;
  }
}

const renderSaveStatus = (saved, hide) => {
  if (hide)
    saveStatusElem.innerHTML = '';
  else
    saveStatusElem.innerHTML =
      saved ? `Saved ${checkmark}` : 'Saving...';
}

const saveProgress = async () => {
  await savePatternProgress(savedPatterns);
  renderSaveStatus(true);
}

let timeout;
function watchInput(callback) {
  // set 1s timer every time we get an input
  if (timeout) {
    clearTimeout(timeout);
    timeout = setTimeout(callback, 1000);
  } else {
    timeout = setTimeout(callback, 1000);
  }
}

const watchSavingProgress = () => {
  // wait for user to stop typing and save
  renderSaveStatus(false);
  watchInput(saveProgress);
}

(async () => {
  try {
    await setupDB();
    await loadAllPatterns();
    patternKey = await getInProgressKey();
    setPatternInProgress(patternKey);
  } catch (e) {
    const patternHeaderElem = document.querySelector('.pattern-header');
    const patternInfoElem = document.querySelector('.pattern-info');
    renderError(e, stepsListElem, [patternHeaderElem, patternInfoElem, rowCounterElem.parentElement]);
  }

  addNumInputListener(sectionCounterElem, updateCounters, []);
  addNumInputListener(rowCounterElem, updateCounters, []);
  addPatternListPopupListeners();
  addCollapseListeners();
})();

onpagehide = () => {
  // quickly save to localStorage before leaving
  saveInProgressKey(patternKey);
}

sectionCounterElem.addEventListener('input', () => {
  watchSavingProgress();
});
rowCounterElem.addEventListener('input', () => {
  watchSavingProgress();
});

function addPatternListPopupListeners() {
  const patternListPopup = document.querySelector('.js-select-pattern-popup');
  const patternListPopupButton = patternListPopup.previousElementSibling;
  const closePatternListButton = patternListPopup.querySelector('.js-close-button');
  const afterListElem = patternListPopup.querySelector('.js-after-form');

  addPopupListeners([patternListPopupButton], [closePatternListButton], [afterListElem], () => renderPatternList(setPatternInProgress));
}

function addCollapseListeners() {
  document.querySelectorAll('.js-collapse')
    .forEach(collapse => {
      const content = collapse.nextElementSibling;
      content.classList.add('hidden');

      collapse.addEventListener('click', () => {
        collapse.classList.toggle('active');
        content.classList.toggle('hidden');
      });
    });
}

function setPatternInProgress(idx) {
  patternKey = idx;
  setSelectedPattern(savedPatterns[patternKey]);
  setTitle(document.title + `: ${selectedPattern.title}`);
  if (!selectedPattern.progress) {
    selectedPattern.progress = {
      sectionCount: 1,
      rowCount: 1
    };
  }
  patternProgress = selectedPattern.progress;

  console.log(idx, patternProgress);
  setLoadedPattern(patternKey);
  renderPatternInProgress();
  renderSaveStatus(false, true);
}

function updateCounters() {
  const secInput = Number(sectionCounterElem.value);
  const rowInput = Number(rowCounterElem.value);
  const { sectionCount, rowCount } = patternProgress;

  // figure out which one changed
  if (secInput !== sectionCount) {
    const sectionMax = selectedPattern.steps.length;
    // prevent invalid section
    patternProgress.sectionCount = Math.min(Math.max(secInput, 1), sectionMax);
    // clamp row counter
    const currSection = selectedPattern.steps[patternProgress.sectionCount - 1];
    const rowMax =
      currSection[currSection.length - 1].end ||
      currSection[currSection.length - 1].start;
    patternProgress.rowCount = Math.min(rowCount, rowMax);
  }
  else if (rowInput !== rowCount) {
    const currSection = selectedPattern.steps[sectionCount - 1];
    // min is always 1
    const rowMax =
      currSection[currSection.length - 1].end ||
      currSection[currSection.length - 1].start;
    const oob = ((value, min, max) => {
      if (value < min) return value - min;
      else if (value > max) return value - max;
      else return 0;
    })(rowInput, 1, rowMax);

    // + overflow
    if (oob > 0) {
      if (oob === 1 && selectedPattern.steps[sectionCount]) {
        // go to next section
        patternProgress.sectionCount++;
        patternProgress.rowCount = 1;
      } else {
        // set to max value
        patternProgress.rowCount = rowMax;
      }
    }
    // - underflow 
    else if (oob < 0) {
      if (oob === -1 && selectedPattern.steps[sectionCount - 2]) {
        // back up to previous section
        const prevSection = selectedPattern.steps[sectionCount - 2];
        const prevRowMax =
          prevSection[prevSection.length - 1].end ||
          prevSection[prevSection.length - 1].start;
        patternProgress.sectionCount--;
        patternProgress.rowCount = prevRowMax;
      } else {
        // set to min value
        patternProgress.rowCount = 1;
      }
    } else {
      patternProgress.rowCount = Math.min(Math.max(rowInput, 1), rowMax);
    }
  }
  renderCounters();
  renderSteps();
}

function generateHookMini(hook, index) {
  const type = selectedPattern.hooks.type;
  let hookHTML = '';

  if (hook) {
    const hookStr = `${type.prefix} ${Object.keys(type.sizes)[index]}`;
    hookHTML += `<div class="hook-mini-item">${hookStr}</div>`
  }
  return hookHTML;
}

function generateYarnMini(yarn, index) {
  const { name, amount, units, images } = yarn;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Mini) : '';

  return `<div class="yarn-mini-item">
    <div class="yarn-image">${imageDisplay}</div>
    <div class="yarn-name">${name}</div>
    <div class="yarn-qty">
      <span class="yarn-amt">${amount}</span>
      <span class="yarn-units">${units}</span></div></div>
  </div>`;
}

function generateGlossaryMini(entry, index) {
  const { term, description, images } = entry;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Mini) : '';

  return `<div class="glossary-mini-item">
  <div class="glossary-image">${imageDisplay}</div>
  <span class="glossary-term">${term}</span>
  <span class="glossary-desc">${description}</span></div>`;
}

function generateStepInUse(step, index) {
  const { start, end, instructions, images } = step;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Bigger) : '';
  const rowString =
    end ? `${start} - ${end}` : `${start}`;

  return `<div class="step-in-use-item" data-step-idx="${index}">
  <div class="step-text">
  <span class="step-rows">${rowString}</span>
  <span class="step-instrs">${instructions}</span></div>
  <div class="step-image">${imageDisplay}</div></div>`;
}