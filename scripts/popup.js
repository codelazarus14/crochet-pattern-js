const screenDimmer = document.querySelector('.js-screen-dimmer');
let visiblePopup;

screenDimmer.addEventListener('click', () => {
  hidePopup();
});

function showPopup(popup) {
  screenDimmer.classList.add('cover-page');
  visiblePopup = popup;
  visiblePopup.classList.remove('hidden');
}

function hidePopup() {
  screenDimmer.classList.remove('cover-page');
  visiblePopup.classList.add('hidden');
}