class Pattern {
  type;

  constructor(type) {
    this.type = type;
  }
}

const patterns = [new Pattern('US Crochet')];
const patternSelectElement = document.querySelector('.js-pattern-types');

patternSelectElement.addEventListener('click', () => {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');
});
renderProjectOptions();

function renderProjectOptions() {
  let projectOptionsHTML = '';

  patterns.forEach(pattern => {
    const patternType = pattern.type;
    const html = `<option value="
        ${patternType.toLowerCase()}
      ">${patternType}</option>`;
    projectOptionsHTML += html;
  });

  patternSelectElement.innerHTML = projectOptionsHTML;
}