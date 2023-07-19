const materialsListElem = document.querySelector('.js-materials-list');
const glossaryListElem = document.querySelector('.js-glossary-list');
const stepsListElem = document.querySelector('.js-steps-list');
const counterElem = document.querySelector('.js-counter');
const sectionElem = document.querySelector('.js-section');

const renderBasicInfoMini = () => {
  document.querySelector('.js-pattern-title').innerHTML =
    patternInUse.title;
  document.querySelector('.js-pattern-author').innerHTML =
    patternInUse.author;
  document.querySelector('.js-pattern-desc').innerHTML =
    patternInUse.desc;
}

const renderCounters = () => {
  let { sectionCount, rowCount } = patternProgress;
  if (!rowCount) patternProgress.rowCount = 1;
  if (!sectionCount) patternProgress.sectionCount = 1;

  counterElem.value = patternProgress.rowCount;
  if (patternInUse.steps.length === 1)
    sectionElem.classList.add('is-hidden');
  else
    sectionElem.innerHTML = patternProgress.sectionCount;
}

const renderHooksMini = () => {
  let hookListElem = document.querySelector('.js-hooks-mini');
  if (!hookListElem) {
    hookListElem = document.createElement('div');
    hookListElem.setAttribute('class', 'hooks-mini js-hooks-mini');
    materialsListElem.appendChild(hookListElem);
  }
  renderListElement(hookListElem, patternInUse.hooks, generateHookMini);
}

const renderYarnsMini = () => {
  let yarnListElem = document.querySelector('.js-yarns-mini');
  if (!yarnListElem) {
    yarnListElem = document.createElement('div');
    yarnListElem.setAttribute('class', 'yarns-mini js-yarns-mini');
    materialsListElem.appendChild(yarnListElem);
  }
  renderListElement(yarnListElem, patternInUse.yarns, generateYarnMini);
}

const renderGlossaryMini = () => {
  renderListElement(glossaryListElem, patternInUse.glossary, generateGlossaryMini);
}

const renderNotesMini = () => {
  document.querySelector('.js-pattern-notes').innerHTML =
    patternInUse.notes;
}

const renderSteps = () => {
  const section = patternProgress.sectionCount - 1;
  renderListElement(stepsListElem, patternInUse.steps[section], generateStepInUse);
}

const renderPatternInUse = () => {
  renderBasicInfoMini();
  renderCounters();
  switch (patternInUse.type) {
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
  saveProgress();
}

const [patternProgress, patternInUse] = loadPattern(0);

renderPatternInUse();
addNumInputListener(counterElem, updateCounters, []);

function loadPattern(idx) {
  const savedPatterns = localStorage.getItem(PATTERN_KEY);
  if (!savedPatterns || savedPatterns === 'undefined')
    console.error('No saved patterns found!');
  const patterns = JSON.parse(savedPatterns);
  const savedProgress = localStorage.getItem(PROGRESS_KEY);
  const progress = !savedProgress ?
    {
      patternIdx: idx,
      sectionCount: 1,
      rowCount: 1
    }
    : JSON.parse(savedProgress);

  return [progress, patterns[idx]];
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(patternProgress));
}

function updateCounters() {
  // TODO: make section counter editable too
  // TODO: replace some of these checks with regex on input?
  const newRowCount = Number(counterElem.value);
  const { sectionCount, rowCount } = patternProgress;
  const currSection = patternInUse.steps[sectionCount - 1];
  // TODO: remove check for empty sections
  const currMaxRow = currSection.length ?
    currSection[currSection.length - 1][1] ||
    currSection[currSection.length - 1][0]
    : 0;

  // flag first step in pattern
  const patternStart = sectionCount === 1 && rowCount === 1;
  // flag last step in pattern
  const patternEnd =
    sectionCount === patternInUse.steps.length &&
    rowCount === currMaxRow;

  console.log(patternStart, patternEnd);

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
    if (sectionCount === 1 || 1 - newRowCount > 1) {
      // clamp OOB decrease to current section
      patternProgress.rowCount = 1;
    } else {
      // -- to prev section
      const prevSection = patternInUse.steps[sectionCount - 2];
      const prevMaxRow =
        prevSection[prevSection.length - 1][1] ||
        prevSection[prevSection.length - 1][0];
      patternProgress.sectionCount--;
      patternProgress.rowCount = prevMaxRow;
    }
  } else {
    patternProgress.rowCount = Math.min(newRowCount, currMaxRow);
  }
  console.log(patternProgress.sectionCount, patternProgress.rowCount, counterElem.value);
  renderCounters();
  renderSteps();
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

function generateHookMini(hook, index) {
  let hookHTML = '';
  if (hook) {
    const hookStr = 'US ' + Object.values(USHookSizes)[index];
    hookHTML += `<div class="hook-mini-item">${hookStr}</div>`
  }
  return hookHTML;
}

function generateYarnMini(yarn, index) {
  const units = yarnUnits[yarn[2]];
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