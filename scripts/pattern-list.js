const patternListClearElement = document.querySelector('.js-clear-pattern-list');
const patternListElement = document.querySelector('.js-pattern-list');
const missingPatternAlert = document.querySelector('.js-pattern-alert');

const renderPatternList = (updateSaved) => {
  if (updateSaved) saveAllPatterns();

  if (savedPatterns.length < 1) {
    missingPatternAlert.classList.remove('is-hidden');
  } else {
    missingPatternAlert.classList.add('is-hidden');
  }
  renderListElement(patternListElement, savedPatterns, generatePatternListItem);
  addPatternListListeners();
}

function addPatternListListeners() {
  patternListClearElement.addEventListener('click', () => {
    savedPatterns = [];
    renderPatternList(true);
  });

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

  addDeleteListeners(patternListElement, savedPatterns, renderPatternList, [true]);
}

function generatePatternListItem(pattern, index) {
  return `<div class="pattern-list-item js-pattern-list-item" data-pattern-idx="${index}">
  <div class="pattern-title">${pattern.title}</div>
  <div class="pattern-author">${pattern.author}</div>
  <button class="load-pattern js-load-pattern">Load</button>
  <button class="js-delete-button">-</button>
  </div>`
}