let previousPattern;

// common pattern generator code

const patternOptionsFormElement = document.querySelector('.js-pattern-options-form');
const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const saveElement = document.querySelector('.js-save-button');
const submitElement = document.querySelector('.js-submit-button');
const submitAlertElement = document.querySelector('.js-submit-alert');
const refreshElement = document.querySelector('.js-refresh-button');

const renderPatternOptions = async () => {
  try {
    await setupDB();
    savedPatterns = await loadAllPatterns();
    renderPatternList(populatePatternFields);
  } catch (e) {
    // todo: renderError
    alert(e);
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
    selectPattern(type);
  });
}

function addPatternSubmitListeners() {
  // todo: add 'ctrl+s' saving?
  saveElement.addEventListener('click', e => {
    const title = patternTitleInputElement.value.trim();
    const author = patternAuthorInputElement.value.trim();
    const desc = patternDescInputElement.value.trim();
    const result = validatePattern();

    if (result && typeof result === 'string') {
      e.preventDefault();
      submitAlertElement.innerHTML = result;
    } else {
      selectedPattern.title = title;
      selectedPattern.author = author;
      selectedPattern.desc = desc;
      submitAlertElement.innerHTML = '';
      savePattern(selectedPattern);
      location.reload();
    }
  });

  submitElement.addEventListener('click', e => {
    const title = patternTitleInputElement.value.trim();
    const author = patternAuthorInputElement.value.trim();
    const desc = patternDescInputElement.value.trim();
    const result = validatePattern();

    if (result && typeof result === 'string') {
      e.preventDefault();
      submitAlertElement.innerHTML = result;
    } else {
      selectedPattern.title = title;
      selectedPattern.author = author;
      selectedPattern.desc = desc;
      submitAlertElement.innerHTML = '';
      submitPattern(selectedPattern);
    }
  });

  refreshElement.addEventListener('click', () => {
    location.reload();
  });
}

function selectPattern(type) {
  const title = patternTitleInputElement.value.trim();
  const author = patternAuthorInputElement.value.trim();
  const desc = patternDescInputElement.value.trim();

  let setup;

  if (previousPattern && previousPattern.type === type) return;
  switch (type) {
    case PatternTypes.USCrochet:
      selectedPattern = new CrochetPattern(title, author, desc);
      setup = setupCrochet;
      break;
    default:
      selectedPattern = new Pattern();
  }
  previousPattern = selectedPattern;
  setup();
}

function populatePatternFields() {
  // don't copy any saved progress, in case we submit later
  delete selectedPattern.progress;

  patternTitleInputElement.value = selectedPattern.title;
  patternAuthorInputElement.value = selectedPattern.author;
  patternDescInputElement.value = selectedPattern.desc;
  patternSelectElement.value = selectedPattern.type;
  switch (selectedPattern.type) {
    case PatternTypes.USCrochet:
      populateCrochetPatternFields();
      break;
  }
}