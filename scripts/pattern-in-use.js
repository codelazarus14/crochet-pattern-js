const materialsListElem = document.querySelector('.js-materials-list');
const glossaryListElem = document.querySelector('.js-glossary-list');
const stepsListElem = document.querySelector('.js-steps-list');
const counterElem = document.querySelector('.js-counter');
const sectionElem = document.querySelector('.js-section');
const patternInUse = loadPattern(0);

const renderBasicInfoMini = () => {
  document.querySelector('.js-pattern-title').innerHTML =
    patternInUse.title;
  document.querySelector('.js-pattern-author').innerHTML = 
    patternInUse.author;
  document.querySelector('.js-pattern-desc').innerHTML =
    patternInUse.desc;
}

const renderCounter = () => {
  let {sectionCounter, rowCounter} = patternInUse;
  if (!sectionCounter) patternInUse.sectionCounter = 0;
  if (!rowCounter) patternInUse.rowCounter = 0;

  counterElem.value = patternInUse.rowCounter + 1;
  sectionElem.innerHTML = patternInUse.sectionCounter + 1;
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
  const section = patternInUse.sectionCounter;
  renderListElement(stepsListElem, patternInUse.steps[section], generateStepInUse);
}

const renderPatternInUse = () => {
  console.log(patternInUse);
  renderBasicInfoMini();
  renderCounter();
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
  /* save progress automatically */
  // TODO: add counter functionality

}

renderPatternInUse();

function loadPattern(idx) {
  const saved =  localStorage.getItem(PATTERN_KEY);
  if (!saved || saved === 'undefined') 
    console.error('No saved patterns found!');
  const patterns = JSON.parse(saved);
  return patterns[idx];
}

function saveProgress(idx) {
  const saved = localStorage.getItem(PATTERN_KEY);
  if (!saved || saved === 'undefined') 
    console.error('No saved patterns found!');
  const patterns = JSON.parse(saved);
  patterns[patterns.length - 1] = patternInUse;
  localStorage.setItem(PATTERN_KEY, patterns);
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
    step[1] ? `${step[0]} - ${step[1]}`: `${step[0]}`;

  return `<div class="step-in-use-item">
  <div class="step-text">
  <span class="step-rows">${rowString}</span>
  <span class="step-instrs">${step[2]}</span></div>
  <div class="step-image biggest">${generateStepImage()}</div></div>`;
}