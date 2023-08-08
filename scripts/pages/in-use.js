let patternKey = loadPatternInProgress();
let patternProgress;

const patternListPopup = document.querySelector('.js-select-pattern-popup');
const patternListPopupButton = patternListPopup.previousElementSibling;
const closePatternListButton = patternListPopup.querySelector('.js-close-button');
const afterListElem = patternListPopup.querySelector('.js-after-form');

const materialsListElem = document.querySelector('.js-materials-list');
const glossaryListElem = document.querySelector('.js-glossary-list');
const stepsListElem = document.querySelector('.js-steps-list');
const counterElem = document.querySelector('.js-counter');
const sectionElem = document.querySelector('.js-section');

const renderBasicInfoMini = () => {
  document.querySelector('.js-pattern-title').innerHTML =
    selectedPattern.title;
  document.querySelector('.js-pattern-author').innerHTML =
    selectedPattern.author;
  document.querySelector('.js-pattern-desc').innerHTML =
    selectedPattern.desc;
}

const renderCounters = () => {
  counterElem.value = patternProgress.rowCount;
  if (selectedPattern.steps.length === 1)
    sectionElem.classList.add('hidden');
  else {
    sectionElem.classList.remove('hidden');
    sectionElem.innerHTML = `Section ${patternProgress.sectionCount}`;
  }
}

const renderHooksMini = () => {
  let hookListElem = document.querySelector('.js-hooks-mini');
  if (!hookListElem) {
    hookListElem = document.createElement('div');
    hookListElem.setAttribute('class', 'hooks-mini js-hooks-mini');
    materialsListElem.appendChild(hookListElem);
  }
  renderListElement(hookListElem, selectedPattern.hooks, generateHookMini);
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
    selectedPattern.notes;
}

const renderSteps = () => {
  const section = patternProgress.sectionCount - 1;
  renderListElement(stepsListElem, selectedPattern.steps[section], generateStepInUse);
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

onunload = () => {
  savePatternInProgress(patternKey);
  // save progress for all patterns
  saveAllPatterns();
}

setPatternInProgress(patternKey);
addNumInputListener(counterElem, updateCounters, []);
addCollapseListeners();

// popup listeners 
// todo: merge with sidebar's?

patternListPopupButton.addEventListener('click', () => {
  showPopup(patternListPopupButton.nextElementSibling);
  renderPatternList(setPatternInProgress);
});

closePatternListButton.addEventListener('click', () => {
  hidePopup();
});

afterListElem.addEventListener('focus', () => {
  // loop tab navigation back to top
  closePatternListButton.focus();
});

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
  selectedPattern = savedPatterns[patternKey];
  setTitle(document.title + `: ${selectedPattern.title}`);
  if (!selectedPattern.progress) {
    selectedPattern.progress = {
      sectionCount: 1,
      rowCount: 1
    };
  }
  patternProgress = selectedPattern.progress;

  console.log(selectedPattern, patternProgress);
  setLoadedPattern(patternKey);
  renderPatternInProgress();
}

function updateCounters() {
  // TODO: make section counter editable too
  // TODO: replace some of these checks with regex on input?
  const newRowCount = Number(counterElem.value);
  const { sectionCount, rowCount } = patternProgress;
  const currSection = selectedPattern.steps[sectionCount - 1];
  const currMaxRow =
    currSection[currSection.length - 1][1] ||
    currSection[currSection.length - 1][0];

  // flag first step in pattern
  const patternStart = sectionCount === 1 && rowCount === 1;
  // flag last step in pattern
  const patternEnd =
    sectionCount === selectedPattern.steps.length &&
    rowCount === currMaxRow;

  if (newRowCount > currMaxRow && !patternEnd) {
    if (newRowCount - currMaxRow > 1) {
      // clamp OOB increase to current section
      patternProgress.rowCount = currMaxRow;
    } else {
      // ++ to next section
      patternProgress.sectionCount++;
      patternProgress.rowCount = 1;
    }
  } else if (newRowCount < 1 && !patternStart) {
    if (newRowCount < 0) {
      // clamp OOB decrease to current section
      patternProgress.rowCount = 1;
    } else {
      // -- to prev section
      const prevSection = selectedPattern.steps[sectionCount - 2];
      const prevMaxRow =
        prevSection[prevSection.length - 1][1] ||
        prevSection[prevSection.length - 1][0];
      patternProgress.sectionCount--;
      patternProgress.rowCount = prevMaxRow;
    }
  } else {
    // clamp 1..maxRow
    patternProgress.rowCount =
      Math.min(Math.max(newRowCount, 1), currMaxRow);
  }
  renderCounters();
  renderSteps();
}

function generateHookMini(hook, index) {
  let hookHTML = '';
  if (hook) {
    const hookStr = 'US ' + Object.values(USHookSizes)[index];
    hookHTML += `<div class="hook-mini-item">${hookStr}</div>`
  }
  return hookHTML;
}

function generateYarnMini(yarn, index) {
  const units = yarnUnitNames[yarn[2]];
  return `<div class="yarn-mini-item">
    <div class="yarn-image tiny">${generateYarnImage()}</div>
    <span class="yarn-name">${yarn[0]}</span>
    <span class="yarn-amt">${yarn[1]}</span>
    <span class="yarn-units">${units}</span></div>
  </div>`;
}

function generateGlossaryMini(entry, index) {
  return `<div class="glossary-mini-item">
  <div class="glossary-image bigger">${generateGlossaryImage()}</div>
  <span class="glossary-term">${entry[0]}</span>
  <span class="glossary-desc">${entry[1]}</span></div>`;
}

function generateStepInUse(step, index) {
  const rowString =
    step[1] ? `${step[0]} - ${step[1]}` : `${step[0]}`;

  return `<div class="step-in-use-item">
  <div class="step-text">
  <span class="step-rows">${rowString}</span>
  <span class="step-instrs">${step[2]}</span></div>
  <div class="step-image biggest">${generateStepImage()}</div></div>`;
}