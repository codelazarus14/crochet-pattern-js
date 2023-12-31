import {
  CrochetPattern,
  PatternTypes,
  selectedPattern,
  setSelectedPattern,
} from "../data/pattern-types.js";
import {
  loadAllPatterns,
  savePattern,
  saveSubmittedKey,
  savedPatterns,
  setupDB,
  submitPattern
} from "../data/persistence.js";
import {
  sanitize
} from "../utils/input.js";
import {
  generateDefaultSelectOption,
  generateOptionHTML,
  renderListElement,
  renderError
} from "../utils/output.js";
import { renderPatternList } from "./pattern-list.js";

let previousPattern;

// common pattern generator code

const patternOptionsFormElement = document.querySelector('.js-pattern-options-form');
const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const patternImportElement = document.querySelector('.js-import-pattern');

const saveElement = document.querySelector('.js-save-button');
const submitElement = document.querySelector('.js-submit-button');
const submitAlertElement = document.querySelector('.js-submit-alert');
const refreshElement = document.querySelector('.js-refresh-button');

export const renderPatternOptions = async (onPatternLoad) => {
  try {
    await setupDB();
    await loadAllPatterns();
    renderPatternList(() => {
      populatePatternFields(onPatternLoad);
    });
  } catch (e) {
    const patternOptionsElem = document.querySelector('.pattern-options');
    renderError(e, patternOptionsElem, []);
  }

  renderListElement(patternSelectElement, Object.values(PatternTypes), generateOptionHTML);
  patternSelectElement.innerHTML = generateDefaultSelectOption('Choose here') + patternSelectElement.innerHTML;

  patternSelectElement.addEventListener('change', () => {
    patternOptionsFormElement.requestSubmit();
    if (!patternOptionsFormElement.checkValidity())
      patternSelectElement.value = patternSelectElement.defaultValue;
  });

  patternOptionsFormElement.addEventListener('submit', e => {
    e.preventDefault();
    const type = patternSelectElement.value;
    createPattern(type);
    onPatternLoad();
  });

  patternImportElement.addEventListener('change', () => {
    if (patternImportElement.files) {
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        const imported = JSON.parse(e.target.result);
        setSelectedPattern(imported);
        populatePatternFields(onPatternLoad);
      });
      reader.readAsText(patternImportElement.files[0]);
    }
  });
}

export function addPatternSubmitListeners(validateFunc) {
  document.addEventListener('keydown', async e => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      await validateAndSavePattern(e, validateFunc, savePattern);
    }
  });

  saveElement.addEventListener('click', async e => {
    await validateAndSavePattern(e, validateFunc, savePattern);
  });

  submitElement.addEventListener('click', async e => {
    await validateAndSavePattern(e, validateFunc, submitPattern);
  });

  refreshElement.addEventListener('click', () => {
    location.reload();
  });
}

// TODO: refactor to move pattern creation into submit/validate
function createPattern(type) {
  const title = sanitize(patternTitleInputElement.value.trim());
  const author = sanitize(patternAuthorInputElement.value.trim());
  const desc = sanitize(patternDescInputElement.value.trim());

  if (previousPattern && previousPattern.type === type) return;
  switch (type) {
    case PatternTypes.USCrochet:
      setSelectedPattern(
        new CrochetPattern(title, author, desc));
      break;
  }
  previousPattern = selectedPattern;
}

function populatePatternFields(loadAction) {
  // don't copy any saved progress, in case we submit later
  delete selectedPattern.progress;

  patternTitleInputElement.value = selectedPattern.title;
  patternAuthorInputElement.value = selectedPattern.author;
  patternDescInputElement.value = selectedPattern.desc;
  patternSelectElement.value = selectedPattern.type;
  loadAction();
}

async function validateAndSavePattern(e, validateFunc, saveFunc) {
  const title = sanitize(patternTitleInputElement.value.trim());
  const author = sanitize(patternAuthorInputElement.value.trim());
  const desc = sanitize(patternDescInputElement.value.trim());
  const result = validateFunc();

  if (result && typeof result === 'string') {
    e.preventDefault();
    submitAlertElement.innerHTML = result;
  } else {
    selectedPattern.title = title;
    selectedPattern.author = author;
    selectedPattern.desc = desc;
    submitAlertElement.innerHTML = '';

    switch (saveFunc) {
      case savePattern:
        await savePattern(selectedPattern);
        location.reload();
        break;
      case submitPattern:
        await submitPattern(selectedPattern);
        saveSubmittedKey(savedPatterns.length);
        location.assign('./preview.html');
    }
  }
}