class Pattern {
  type;

  constructor(type) {
    this.type = type;
  }
}

class CrochetPattern extends Pattern {
  constructor() {
    super('US Crochet');
    this.hookSizes = ['US L'];
    this.hooks = [];
    this.yarns = [];
  }
}

const patterns = [new CrochetPattern()];
let selectedPattern = patterns[0];

const patternSelectElement = document.querySelector('.js-pattern-types');
const hookInputElement = document.querySelector('.js-hook-types');
const hookConfirmInputElement = document.querySelector('.js-hook-confirm');
const hookListElement = document.querySelector('.js-hook-list');
const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnConfirmInputElement = document.querySelector('.js-yarn-confirm');
const yarnListElement = document.querySelector('.js-yarn-list');

// TODO - replace with better events
patternSelectElement.addEventListener('click', () => {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');
  selectedPattern = patterns[patternSelectElement.selectedIndex];
});
hookConfirmInputElement.addEventListener('click', () => {
  const idx = hookInputElement.selectedIndex;
  const hook = hookInputElement.options[idx].text;
  selectedPattern.hooks.push(hook);
  renderHooks();
});
yarnConfirmInputElement.addEventListener('click', () => {
  const yarnName = yarnNameInputElement.value;
  const yarnAmt = Number(yarnAmtInputElement.value);
  selectedPattern.yarns.push([yarnName, yarnAmt]);
  renderYarn();
});
const renderPattern = () => renderElement(patternSelectElement, patterns, generatePatternHTML);
const renderHooks = () => renderElement(hookListElement, selectedPattern.hooks, generateHookHTML);
const renderYarn = () => renderElement(yarnListElement, selectedPattern.yarns, generateYarnHTML);

renderPattern();
renderHooks();
renderYarn();



function renderElement(element, elementData, htmlGenerator) {
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  element.innerHTML = html;

  document.querySelectorAll('.js-delete-hook-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        selectedPattern.hooks.splice(index, 1);
        renderHooks();
      });
    });
  
    document.querySelectorAll('.js-delete-yarn-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        selectedPattern.yarns.splice(index, 1);
        renderYarn();
      });
    });
}

function generatePatternHTML(pattern, index) {
  const patternType = pattern.type;
  return `<option value="${patternType.toLowerCase()}">
  ${patternType}</option>`;
}

function generateHookHTML(hookSize, index) {
  return `<p>${index + 1}.</p>
  <p>${hookSize}</p>
  <button class="js-delete-hook-button">-</button>`;
}

function generateYarnHTML(yarn, index) {
  return `<p>${yarn[0]}</p>
  <input class="yarn-amt" type="number" value="${yarn[1]}"><p>skeins</p>
  <button class="js-delete-yarn-button">-</button>`;
}