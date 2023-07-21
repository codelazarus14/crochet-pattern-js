let previousPattern;

// common pattern header code

const patternOptionsFormElement = document.querySelector('.js-pattern-options-form');
const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const renderPatternOptions = () => {
  savedPatterns = loadAllPatterns();
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