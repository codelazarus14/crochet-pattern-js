class Pattern {
  constructor(title, author, desc, type) {
    this.title = title;
    this.author = author;
    this.desc = desc;
    this.type = type;
  }
}

class CrochetPattern extends Pattern {
  constructor(title, author, desc) {
    super(title, author, desc, PatternTypes.USCrochet);
    this.hooks = [];
    this.yarns = [];
    this.glossary = [];
    this.notes = '';
    this.steps = [];
    this.currMaxStep = 0;
  }
}

const PatternTypes = {
  USCrochet: 'US Crochet'
};

const USHookSizes = {
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

const patternTitleInputElement = document.querySelector('.js-pattern-title');
const patternAuthorInputElement = document.querySelector('.js-pattern-author');
const patternDescInputElement = document.querySelector('.js-pattern-desc');
const patternSelectElement = document.querySelector('.js-pattern-types');

const hookInputElement = document.querySelector('.js-hook-types');
const hookListElement = document.querySelector('.js-hook-list');

const yarnNameInputElement = document.querySelector('.js-yarn-name');
const yarnUnitsInputElement = document.querySelector('.js-yarn-units');
const yarnAmtInputElement = document.querySelector('.js-yarn-amt');
const yarnConfirmInputElement = document.querySelector('.js-yarn-confirm');
const yarnListElement = document.querySelector('.js-yarn-list');

const glossaryTermInputElement = document.querySelector('.js-term-input');
const glossaryDescInputElement = document.querySelector('.js-desc-input');
const glossaryConfirmInputElement = document.querySelector('.js-glossary-confirm');

const glossaryListElement = document.querySelector('.js-glossary-list');

const notesInputElement = document.querySelector('.js-notes-input');

const stepRowInputElement = document.querySelector('.js-row-input');
const stepInstrInputElement = document.querySelector('.js-instr-input');
const stepConfirmElement = document.querySelector('.js-step-confirm');
const stepsListElement = document.querySelector('.js-steps-list');

const renderPatternOptions = () =>
  renderElement(patternSelectElement, Object.values(PatternTypes), generateOptionHTML);
const renderHookList = () => {
  renderElement(hookListElement, selectedPattern.hooks, generateHookListHTML);
};
const renderYarnList = () => {
  renderElement(yarnListElement, selectedPattern.yarns, generateYarnHTML);
  setDeleteListeners('yarn', selectedPattern.yarns, renderYarnList);
  // TODO: set update listeners on yarn amount changes (in list)
};
const renderGlossary = () => {
  renderElement(glossaryListElement, selectedPattern.glossary, generateGlossaryEntryHTML);
  setDeleteListeners('glossary', selectedPattern.glossary, renderGlossary);
}
const renderSteps = () => {
  renderElement(stepsListElement, selectedPattern.steps, generateStepHTML);
  // TODO: add step deletion, reverse-checking (put !! next to newly-bad steps)
}

renderPatternOptions(true);

patternSelectElement.addEventListener('click', () => {
  const title = patternTitleInputElement.value.trim();
  const author = patternAuthorInputElement.value.trim();
  const desc = patternDescInputElement.value.trim();
  const idx = patternSelectElement.selectedIndex;
  if (!dropdownOpened) {
    dropdownOpened = true;
  } else {
    dropdownOpened = false;
    selectedPattern = (() => {
      switch (patternSelectElement.options[idx].text) {
        case PatternTypes.USCrochet:
          return new CrochetPattern(title, author, desc);
        default:
          return new Pattern();
      }
    })();
    setupPattern();
  }
});

patternSelectElement.addEventListener('blur', () => dropdownOpened = false);

function setupPattern() {
  document.querySelector('.js-pattern-body').classList.remove('is-hidden');
  // TODO - clear all listeners/refresh page
  
  // render input stuff once so we can change output appearance in listener
  renderElement(hookInputElement, Object.keys(USHookSizes), generateHookSizeButtonsHTML);
  renderElement(yarnUnitsInputElement, [Units.meters, Units.yards, Units.skeins], generateOptionHTML);


  if (selectedPattern.type === PatternTypes.USCrochet) {
    // TODO - make CSS grid to store these in orderly fashion
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
          renderHookList();
        });
      });

    yarnConfirmInputElement.addEventListener('click', () => {
      const yarnName = yarnNameInputElement.value.trim();
      const yarnAmt = Number(yarnAmtInputElement.value);
      const yarnUnits = yarnUnitsInputElement.value;
      selectedPattern.yarns.push([yarnName, yarnAmt, yarnUnits]);
      renderYarnList();
    });

    glossaryConfirmInputElement.addEventListener('click', () => {
      const newTerm = glossaryTermInputElement.value.trim();
      const newDesc = glossaryDescInputElement.value.trim();
      selectedPattern.glossary.push([newTerm, newDesc]);
      renderGlossary();
    });

    notesInputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        selectedPattern.notes = notesInputElement.value.trim();
        console.log(selectedPattern);
      }
    });

    stepConfirmElement.addEventListener('click', (event) => {
      let startIdx, endIdx;
      const rowsInput = stepRowInputElement.value.trim();
      const instrInput = stepInstrInputElement.value.trim();
      // allow 1 | 1,2 | 1-2
      const regex = /^[0-9]+((?![,-])|(,|(\s*-\s*))\s*[0-9]+)$/;
      
      if (!rowsInput.match(regex)) 
        return console.log('invalid input format: not \d | \d,\d | \d-\d!');
      
      const separatorIdx = Math.max(rowsInput.indexOf(','), rowsInput.indexOf('-'));
      // row 1 vs. rows [1,3]
      if (separatorIdx < 0) {
        startIdx = Number(rowsInput);
      } else {
        startIdx = Number(rowsInput.slice(0, separatorIdx));
        endIdx = Number(rowsInput.slice(separatorIdx + 1));
      }
      if (startIdx !== selectedPattern.currMaxStep + 1) 
        return console.log('must start on next row!');
      if (endIdx && endIdx < startIdx) 
        return console.log('row end < start!');
      if (startIdx === endIdx) 
        endIdx = undefined;
        
      selectedPattern.steps.push([startIdx, endIdx, instrInput]);
      selectedPattern.currMaxStep = endIdx || startIdx;
      renderSteps();
    });
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

function generateHookSizeButtonsHTML(option, index) {
  let classes = 'js-hook-size-button';
  if (selectedPattern.hooks[index])
    classes += ' selected';
  return `<button class="${classes}" value="${index}">${option}/${USHookSizes[option]}</button>`;
}

function generateHookListHTML(selected, index) {
  if (!selected) return '';
  return `<p>US 
  ${Object.keys(USHookSizes)[index]} /
  ${Object.values(USHookSizes)[index]}</p>`
}

function generateYarnHTML(yarn, index) {
  return `<p>${yarn[0]}</p>
  <input class="yarn-amt" type="number" value="${yarn[1]}"><p>${yarn[2]}</p>
  <button class="js-delete-yarn-button">-</button>`;
}

function generateGlossaryEntryHTML(entry, index) {
  return `<p><span class="glossary-term">${entry[0]}</span>: ${entry[1]}</p>
  <button class="js-delete-glossary-button">-</button>`;
}

function generateStepHTML(step, index) {
  const rowString = step[1] ? `Rows ${step[0]} - ${step[1]}` : `Row ${step[0]}`;
  return `<p class="step-rows">${rowString}</p>
  <p class="step-instrs">${step[2]}</p>`;
}