const displayElement = document.querySelector('.js-preview-display');
const submittedPattern = JSON.parse(localStorage.getItem(PATTERN_KEY));

if (submittedPattern) {
  displayElement.innerHTML = JSON.stringify(submittedPattern);
}