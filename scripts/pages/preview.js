import {
  PatternTypes,
  yarnUnitNames
} from "../data/pattern-types.js";
import {
  loadAllPatterns,
  saveInProgressKey,
  savedPatterns,
  setupDB
} from "../data/persistence.js";
import {
  generateImagePreview,
  invalidColor,
  renderListElement,
  setTitle,
  ImageStyles,
  renderImageDisplay
} from "../utils/output.js";

const basicInfoElement = document.querySelector('.js-basic-info');
const hookPreviewElement = document.querySelector('.js-hook-preview');
const yarnPreviewElement = document.querySelector('.js-yarn-preview');
const glossaryPreviewElement = document.querySelector('.js-glossary-preview');
const notesPreviewElement = document.querySelector('.js-notes-preview');
const stepsPreviewElement = document.querySelector('.js-steps-preview');

const exportPDFElement = document.querySelector('.js-export-pdf');
const exportJSONElement = document.querySelector('.js-export-json');
const usePatternElement = document.querySelector('.js-use-pattern');

let submittedPattern;

const renderBasicInfo = () => {
  const title = submittedPattern.title;
  const author = submittedPattern.author;
  const desc = submittedPattern.desc;
  basicInfoElement.innerHTML += generateTitlePreview(title);
  basicInfoElement.innerHTML += generateAuthorPreview(author);
  basicInfoElement.innerHTML += generateDescriptionPreview(desc);
}

const renderHooks = () =>
  renderListElement(hookPreviewElement, submittedPattern.hooks.values, generateHookPreview);

const renderYarns = () =>
  renderListElement(yarnPreviewElement, submittedPattern.yarns, generateYarnPreview);

const renderGlossary = () =>
  renderListElement(glossaryPreviewElement, submittedPattern.glossary, generateGlossaryEntryPreview);

const renderNotes = () =>
  notesPreviewElement.innerHTML = generateNotesPreview(submittedPattern.notes);

const renderSteps = () => {
  // render sections
  renderListElement(stepsPreviewElement, submittedPattern.steps, generateSectionPreview);

  // render steps within each section
  const sectionPreviews = stepsPreviewElement.querySelectorAll('.js-section-preview');
  sectionPreviews.forEach((section, index) => {
    if (sectionPreviews.length > 1) {
      section.querySelector('.js-section-heading')
        .innerHTML = `Section ${index + 1}`;
    }
    renderListElement(section.querySelector('.js-steps-list'), submittedPattern.steps[index], generateStepPreview);
  });
}

const renderPatternPreview = () => {
  renderBasicInfo();

  switch (submittedPattern.type) {
    case PatternTypes.USCrochet:
      renderHooks();
      renderYarns();
      renderGlossary();
      renderNotes();
      renderSteps();
      break;
  }
}

const renderError = (e) => {
  document.querySelector('.preview-options').classList.add('hidden');
  const innerElem = document.querySelector('.inner');
  innerElem.innerHTML = e;
  innerElem.style.color = invalidColor;
}

(async () => {
  try {
    await setupDB();
    await loadAllPatterns();
    // assume last pattern on the list was the new one
    submittedPattern = savedPatterns[savedPatterns.length - 1];
    setTitle(document.title + `: ${submittedPattern.title}`);
    renderPatternPreview();
  } catch (e) {
    renderError(e);
  }
})();

exportPDFElement.addEventListener('click', () => {
  print();
})

exportJSONElement.addEventListener('click', () => {
  // TODO: implement JSON export
})

usePatternElement.addEventListener('click', () => {
  const patternKey = savedPatterns.length - 1;
  saveInProgressKey(patternKey);
});

function generateTitlePreview(title) {
  return `<span class="pattern-title">${title}</span>`
}

function generateAuthorPreview(author) {
  return `<div class="pattern-author">by <span class="author">${author}</span></div>`
}

function generateDescriptionPreview(desc) {
  if (!desc) return '';
  return `<div class="description-preview>${desc}</div>`;
}

function generateHookPreview(hook, index) {
  const type = submittedPattern.hooks.type;
  let hookHTML = '';
  if (hook) {
    const hookStr = `${type.prefix} ${Object.values(type.sizes)[index]}`;
    hookHTML += `<div class="hook-preview-item">${hookStr}</div>`
  }
  return hookHTML;
}

function generateYarnPreview(yarn, index) {
  const { name, amount, units, images } = yarn;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Preview) : '';
  const firstItem = !index ? 'first ' : '';

  return `<div class="${firstItem}yarn-preview-item">
  <div class="yarn-image">${imageDisplay}</div>
  <div class="yarn">
    <div class="yarn-name">${name}</div>
    <div class="separator">-</div>
    <div class="yarn-qty">
      <span class="yarn-amt">${amount}</span>
      <span class="yarn-units">${units}</span></div></div>
  </div>`;
}

function generateGlossaryEntryPreview(entry, index) {
  const { term, description, images } = entry;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Preview) : '';
  const firstItem = !index ? 'first ' : '';

  return `<div class="${firstItem}glossary-preview-item">
  <div class="glossary-image">${imageDisplay}</div>
  <span class="glossary-term">${term}</span>
  <span class="glossary-desc">${description}</span></div>`;
}

function generateNotesPreview(notes) {
  return `<span class="notes">${notes.text}</span>`;
}

function generateSectionPreview(section, index) {
  const firstItem = !index ? 'first ' : '';

  return `<div class="${firstItem}section-preview-item js-section-preview">
  <div class="section-heading js-section-heading"></div>
  <div class="step-list js-steps-list"></div></div>`;
}

function generateStepPreview(step, index) {
  const { start, end, instructions, images } = step;
  const rowStr =
    end ? `R${start} - ${end}` : `R${start}`;
  const imageDisplay = images ?
    renderImageDisplay(images, ImageStyles.Preview) : '';
  const firstItem = !index ? 'first ' : '';

  return `<div class="${firstItem}step-preview-item">
  <div class="step">
    <span class="step-rows">${rowStr}</span>
    <span class="step-instrs">${instructions}</span></div>
  <div class="step-image">${imageDisplay}</div></div>`;
}