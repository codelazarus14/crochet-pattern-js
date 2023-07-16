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