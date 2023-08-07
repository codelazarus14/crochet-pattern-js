const sidebar = document.querySelector(".sidebar");
// Get the offset position of the sidebar
const sticky = sidebar.offsetTop - 12;

sidebar.querySelectorAll('.sidebar > button')
  .forEach(popupButton => {
    popupButton.addEventListener('click', () => {
      showPopup(popupButton.nextElementSibling);
    });
  });

sidebar.querySelectorAll('.js-close-button')
  .forEach(closeButton => {
    closeButton.addEventListener('click', () => {
      hidePopup();
    });
  });

sidebar.querySelectorAll('.js-after-form').forEach(after => {
  after.addEventListener('focus', () => {
    // loop tab navigation back to top
    const closeButton = after.parentElement.querySelector('.js-close-button');
    closeButton.focus();
  });
});

// Convert Units popup

const convertUnitsForm = sidebar.querySelector('.js-convert-units-form');
const convertFromUnitsElem = sidebar.querySelector('.js-convert-from-units');
const convertToUnitsElem = sidebar.querySelector('.js-convert-to-units');
const skeinsElem = sidebar.querySelector('.js-convert-skeins');
const skeinAmtElem = sidebar.querySelector('.js-convert-skeins-amt');
const skeinUnitsElem = sidebar.querySelector('.js-convert-skeins-units');

const convertFromAmtElem = sidebar.querySelector('.js-convert-from-amt');
const fromUnitsDisplay = sidebar.querySelector('.js-from-units-display');
const convertToAmtElem = sidebar.querySelector('.js-convert-to-amt');
const toUnitsDisplay = sidebar.querySelector('.js-to-units-display');
const copyFromAmtElem = sidebar.querySelector('.js-copy-from-amt');
const copyToAmtElem = sidebar.querySelector('.js-copy-to-amt');

const renderSelect = (elem, data) => {
  renderListElement(elem, data, generateOptionHTML);
  addSelectListener(elem, () => {
    renderUnitsDisplay();
    toggleSkeinsUnits();
    convertUnitsForm.requestSubmit();
  }, []);
}

const renderUnitsDisplay = () => {
  fromUnitsDisplay.innerHTML = 
    unitNames[convertFromUnitsElem.selectedIndex];
  toUnitsDisplay.innerHTML = 
    unitNames[convertToUnitsElem.selectedIndex];
}

const skeinConvertUnits = structuredClone(unitNames);
skeinConvertUnits.splice(skeinConvertUnits.length - 1, 1);

let lastEditedInput;

convertUnitsForm.addEventListener('submit', e => {
  e.preventDefault();
  convertUnits();
});

renderSelect(convertFromUnitsElem, unitNames);
renderSelect(convertToUnitsElem, unitNames);
renderSelect(skeinUnitsElem, skeinConvertUnits);
renderUnitsDisplay();
addConvertListeners(convertFromAmtElem);
addConvertListeners(convertToAmtElem);
skeinAmtElem.addEventListener('blur', () => {
  convertUnitsForm.requestSubmit();
});
copyFromAmtElem.addEventListener('click', () => {
  copyToClipboard(convertFromAmtElem);
});
copyToAmtElem.addEventListener('click', () => {
  copyToClipboard(convertToAmtElem);
});

function addConvertListeners(convertAmtElem) {
  convertAmtElem.addEventListener('input', () => 
    lastEditedInput = convertAmtElem);
  convertAmtElem.addEventListener('blur', () =>
    convertUnitsForm.requestSubmit());
}

function toggleSkeinsUnits() {
  const convertFromSkeins = 
    convertFromUnitsElem.selectedIndex === Object.values(Units).length - 1;
  const convertToSkeins = 
    convertToUnitsElem.selectedIndex === Object.values(Units).length - 1;
  const shouldDisplay = convertFromSkeins || convertToSkeins;
  
  skeinsElem.classList.toggle('hidden', !shouldDisplay);
  skeinAmtElem.toggleAttribute('required', shouldDisplay);
  if (!convertFromSkeins && !convertToSkeins) {
    skeinsElem.value = skeinsElem.defaultValue;
  }
}

function convertUnits () {
  // wait for user to enter something first
  if (!lastEditedInput) return;
  
  const units = Object.values(Units);
  // skeins don't have a second entry (mm length) in Units
  const fromSkeins = !units[convertFromUnitsElem.selectedIndex][1];
  const toSkeins = !units[convertToUnitsElem.selectedIndex][1];
  const skeinMM = 
    units[skeinUnitsElem.selectedIndex][1] * Number(skeinAmtElem.value);
  const fromMM = fromSkeins ? skeinMM
    : units[convertFromUnitsElem.selectedIndex][1];
  const toMM = toSkeins ? skeinMM
    : units[convertToUnitsElem.selectedIndex][1];
  const toConvert = lastEditedInput.value;

  let result;

  if (lastEditedInput === convertFromAmtElem) {
    // 4-decimal precision cuz it looks good ig
    result = Math.round(10000 * toConvert * fromMM / toMM) / 10000;
    convertToAmtElem.value = result;
  } else {
    result = Math.round(10000 * toConvert * toMM / fromMM) / 10000;
    convertFromAmtElem.value = result;
  }
}

function copyToClipboard(input) {
  input.select();
  // mobile compat? breaks this code so nvm
  // input.setSelectionRange(0, input.value.length);
  navigator.clipboard.writeText(input.value);
}

// sticky sidebar functionality

window.onscroll = () => makeSticky();

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeSticky() {
  if (window.scrollY >= sticky) {
    sidebar.classList.add("sticky")
  } else {
    sidebar.classList.remove("sticky");
  }
} 