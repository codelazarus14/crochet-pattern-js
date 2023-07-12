let previousPattern;
let selectedPattern;
let savedPatterns;

// common pattern header code

const patternOptionsFormElement = document.querySelector('.js-pattern-options-form');
const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const loadPatternList = document.querySelector('.js-load-pattern-list');
const missingPatternAlert = document.querySelector('.js-load-pattern-alert');

const renderPatternList = () => {
  if (savedPatterns.length < 1) {
    missingPatternAlert.classList.remove('is-hidden');
  } else {
    missingPatternAlert.classList.add('is-hidden');
  }
  renderListElement(loadPatternList, savedPatterns, generatePatternListItem);
  addPatternListListeners();
}

const renderPatternOptions = () => {
  const saved = localStorage.getItem(PATTERN_KEY);
  savedPatterns = saved ? JSON.parse(saved) : [];
  renderPatternList();

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

function addPatternListListeners() {
  document.querySelectorAll('.js-pattern-list-item')
    .forEach(patternElem => {
      const loadButton = patternElem.querySelector('.js-load-pattern');
      loadButton.addEventListener('click', () => {
        const idx = patternElem.dataset.patternIdx;
        selectedPattern = savedPatterns[idx];
        // TODO: add styling and keep track of selected pattern to be updated on Submit
        // ask user if they want to update an existing pattern or save a new copy?
        populatePatternFields();
      });
    });
  
  // TODO: make deletion persistent like Submit
  addDeleteListeners(loadPatternList, savedPatterns, renderPatternList);
}

function populatePatternFields() {
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

function generatePatternListItem(pattern, index) {
  return `<div class="pattern-list-item js-pattern-list-item" data-pattern-idx="${index}">
  <div class="pattern-title">${pattern.title}</div>
  <div class="pattern-author">${pattern.author}</div>
  <button class="load-pattern js-load-pattern">Load</button>
  <button class="js-delete-button">-</button>
  </div>`
}