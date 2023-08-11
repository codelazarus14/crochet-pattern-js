const patternListClearElement = document.querySelector('.js-clear-pattern-list');
const patternListElement = document.querySelector('.js-pattern-list');
const missingPatternAlert = document.querySelector('.js-pattern-alert');

const renderPatternList = (loadAction) => {
  if (savedPatterns.length < 1) {
    missingPatternAlert.classList.remove('hidden');
  } else {
    missingPatternAlert.classList.add('hidden');
  }
  renderListElement(patternListElement, savedPatterns, generatePatternListItem);
  addPatternListListeners(loadAction);
}

function addPatternListListeners(loadAction) {
  patternListClearElement.addEventListener('click', () => {
    savedPatterns = [];
    deleteAllPatterns();
    if (getLoadedPattern)
      location.reload();
    renderPatternList(loadAction);
  });

  document.querySelectorAll('.js-pattern-list-item')
    .forEach((pattern, idx) => {
      const loadButton = pattern.querySelector('.js-load-pattern');
      loadButton.addEventListener('click', () => {
        setLoadedPattern(idx, loadAction);
        renderPatternList(loadAction);
      });
    });

  addDeleteListeners(patternListElement, savedPatterns,
    (delIdx, deleted) => {
      const loaded = getLoadedPattern() && Number(getLoadedPattern());

      if (delIdx === loaded) {
        delete patternListElement.dataset.loadedPattern;
        location.reload();
      }
      else if (delIdx < loaded)
        patternListElement.dataset.loadedPattern--;

      deletePattern(deleted);
      renderPatternList(loadAction);
    }, true);
}

function setLoadedPattern(idx, loadAction) {
  patternListElement.dataset.loadedPattern = idx;
  // clone saved data so we dont reference it directly
  selectedPattern = structuredClone(savedPatterns[idx]);
  if (loadAction) loadAction(idx);
}

function getLoadedPattern() {
  return patternListElement.dataset.loadedPattern;
}

function generatePatternListItem(pattern, index) {
  const loaded = getLoadedPattern() && Number(getLoadedPattern());
  const isLoaded = loaded === index ? 'loaded' : '';
  const first = index === 0 ? 'first' : '';

  return `<div class="pattern-list-item js-pattern-list-item ${isLoaded} ${first}" data-pattern-idx="${index}">
  <span class="pattern-title">${pattern.title}</span>
  <span class="pattern-author">${pattern.author}</span>
  <button class="load-pattern js-load-pattern">Load</button>
  <button class="js-delete-button"></button></div>`
}