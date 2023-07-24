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
        // TODO: fix 'loaded' patterns not saving if list is
        // modified by deletion 
        // (update class selectors/loaded pattern idx)
        const idx = patternElem.dataset.patternIdx;
        // clear previously loaded pattern
        const previousLoaded = patternListElement.querySelector('.loaded');
        if (previousLoaded)
          previousLoaded.classList.remove('loaded');
        // set new one
        patternElem.classList.add('loaded');
        patternListElement.dataset.loadedPattern = idx;
        // clone saved data so we dont reference it directly
        selectedPattern = structuredClone(savedPatterns[idx]);
        populatePatternFields();
      });
    });

  addDeleteListeners(patternListElement, savedPatterns, renderPatternList, [true]);
}

function getLoadedPattern() {
  return patternListElement.dataset.loadedPattern;
}

function generatePatternListItem(pattern, index) {
  return `<div class="pattern-list-item js-pattern-list-item" data-pattern-idx="${index}">
  <div class="pattern-title">${pattern.title}</div>
  <div class="pattern-author">${pattern.author}</div>
  <button class="load-pattern js-load-pattern">Load</button>
  <div class="delete-pattern">
    <a class="js-delete-button">${removeChar}</a></div>
  </div>`
}