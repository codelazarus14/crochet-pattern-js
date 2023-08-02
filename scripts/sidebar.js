const sidebar = document.querySelector(".sidebar");
// Get the offset position of the sidebar
const sticky = sidebar.offsetTop - 12;
const screenDimmer = sidebar.querySelector('.screen-dimmer');
let visiblePopup;

const convertUnitsButton = sidebar.querySelector('.js-convert-units-button');
const convertUnitsPopup = sidebar.querySelector('.js-convert-units-popup');
const convertUnitsForm = sidebar.querySelector('.js-convert-units-form');

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

screenDimmer.addEventListener('click', () => {
  hidePopup();
});

sidebar.querySelectorAll('.js-after-form').forEach(after => {
  after.addEventListener('focus', () => {
    const closeButton = after.parentElement.querySelector('.js-close-button');
    closeButton.focus();
  });
});

// todo: finish popup functionality

function showPopup(popup) {
  screenDimmer.classList.add('cover-page');
  visiblePopup = popup;
  visiblePopup.classList.remove('hidden');
}

function hidePopup() {
  screenDimmer.classList.remove('cover-page');
  visiblePopup.classList.add('hidden');
}


window.onscroll = () => makeSticky();

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeSticky() {
  if (window.scrollY >= sticky) {
    sidebar.classList.add("sticky")
  } else {
    sidebar.classList.remove("sticky");
  }
} 