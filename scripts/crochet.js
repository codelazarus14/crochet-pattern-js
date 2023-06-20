class Pattern {
  type;

  constructor(type) {
    this.type = type;
  }
}

class CrochetPattern extends Pattern {
  constructor() {
    super(PatternTypes.USCrochet);
    this.hooks = [];
    this.yarns = [];
  }
}

const PatternTypes = {
  USCrochet: 'US Crochet'
};

const HookSizes = {
  B: 2.25,
  C: 2.75,
  D: 3.25,
  E: 3.50,
  F: 3.75,
  G: 4.00,
  H: 5.00,
  I: 5.50,
  J: 6.00,
  K: 6.50
}

const Units = {
  mm: "mm",
  in: "in",
  feet: "feet",
  yards: "yards",
  meters: "meters",
  skeins: "skeins"
}

let dropdownOpened = false;
let selectedPattern;

const patternSelectElement = document.querySelector('.js-pattern-types');
const hookInputElement = document.querySelector('.js-hook-types');
const hookListElement = document.querySelector('.js-hook-list');
const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnUnitsInputElement = document.querySelector('.js-yarn-units');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnConfirmInputElement = document.querySelector('.js-yarn-confirm');
const yarnListElement = document.querySelector('.js-yarn-list');

const renderOptions = () =>
  renderElement(patternSelectElement, Object.values(PatternTypes), generateOptionHTML);
const renderHooks = () => {
  renderElement(hookListElement, selectedPattern.hooks, generateHookHTML);
};
const renderYarn = () => {
  renderElement(yarnListElement, selectedPattern.yarns, generateYarnHTML);
  setDeleteListeners('yarn', selectedPattern.yarns, renderYarn);
};

renderOptions(true);

patternSelectElement.addEventListener('click', () => {
  const idx = patternSelectElement.selectedIndex;
  if (!dropdownOpened) {
    dropdownOpened = true;
  } else {
    dropdownOpened = false;
    selectedPattern = (() => {
      switch (patternSelectElement.options[idx].text) {
        case PatternTypes.USCrochet:
          return new CrochetPattern();
        default:
          return new Pattern();
      }
    })();
    console.log(selectedPattern);
    setupPattern();
  }
});

patternSelectElement.addEventListener('blur', () => dropdownOpened = false);

function setupPattern() {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');

  if (selectedPattern.type === PatternTypes.USCrochet) {
    // TODO - make CSS grid to store these in orderly fashion
    renderElement(hookInputElement, Object.keys(HookSizes), generateButtonsHTML);
    document.querySelectorAll('.js-hook-size-button')
      .forEach((button) => {
        button.addEventListener('click', () => {
          if (button.classList.contains('selected')) {
            selectedPattern.hooks[button.value] = false;
            button.classList.remove('selected');
          } else {
            selectedPattern.hooks[button.value] = true;
            button.classList.add('selected');
          }
          renderHooks();
        });
      });
    renderElement(yarnUnitsInputElement, [Units.meters, Units.yards, Units.skeins], generateOptionHTML);

    yarnConfirmInputElement.addEventListener('click', () => {
      const yarnName = yarnNameInputElement.value;
      const yarnAmt = Number(yarnAmtInputElement.value);
      const yarnUnits = yarnUnitsInputElement.value;
      selectedPattern.yarns.push([yarnName, yarnAmt, yarnUnits]);
      renderYarn();
    });

    renderHooks();
    renderYarn();
  }
}

function setDeleteListeners(listName, itemList, renderFunc) {
  document.querySelectorAll(`.js-delete-${listName}-button`)
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        itemList.splice(index, 1);
        renderFunc();
      });
    });
}

function renderElement(element, elementData, htmlGenerator) {
  console.log(selectedPattern);
  let html = '';

  elementData.forEach((item, index) => {
    html += htmlGenerator(item, index);
  });

  element.innerHTML = html;
}

function generateOptionHTML(option, index) {
  return `<option value="${option}">${option}</option>`;
}

function generateButtonsHTML(option, index) {
  return `<button class="js-hook-size-button" value="${index}">${option}/${HookSizes[option]}</button>`;
}

function generateHookHTML(selected, index) {
  if (!selected) return '';
  return `<p>
  ${Object.keys(HookSizes)[index]} /
  ${Object.values(HookSizes)[index]}</p>`
}

function generateYarnHTML(yarn, index) {
  return `<p>${yarn[0]}</p>
  <input class="yarn-amt" type="number" value="${yarn[1]}"><p>${yarn[2]}</p>
  <button class="js-delete-yarn-button">-</button>`;
}