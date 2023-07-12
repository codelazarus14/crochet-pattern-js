let previousPattern;
let selectedPattern;

// common pattern header code

const patternOptionsFormElement = document.querySelector('.js-pattern-options-form');
const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const loadPatternElement = document.querySelector('.js-load-pattern-button');
const missingPatternAlert = document.querySelector('.js-load-pattern-alert');

const renderPatternOptions = () => {
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

  loadPatternElement.addEventListener('click', () => {
    const storedPattern = localStorage.getItem(PATTERN_KEY);
    if (storedPattern) {
      missingPatternAlert.classList.add('is-hidden');
      selectedPattern = JSON.parse(storedPattern);
      populatePatternFields();
    } else {
      missingPatternAlert.classList.remove('is-hidden');
    }
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
  console.log(`loaded stored pattern ${selectedPattern.title}`);
  // TODO: implement fields loaded from pattern
  patternTitleInputElement.value = selectedPattern.title;
  patternAuthorInputElement.value = selectedPattern.author;
  patternDescInputElement.value = selectedPattern.desc;
  switch (selectedPattern.type) {
    case PatternTypes.USCrochet:
      populateCrochetPatternFields();
      break;
  }
}