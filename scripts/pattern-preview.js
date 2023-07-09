const displayElement = document.querySelector('.js-preview-display');
const submittedPattern = JSON.parse(localStorage.getItem('submittedPattern'));

if (submittedPattern) {
  displayElement.innerHTML = JSON.stringify(submittedPattern);
}