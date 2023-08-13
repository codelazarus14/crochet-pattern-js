const screenDimmer = document.querySelector('.js-screen-dimmer');
let visiblePopup;

export function enableScreenDimmer() {
  screenDimmer.addEventListener('click', () => {
    hidePopup();
  });
}

export function showPopup(popup) {
  screenDimmer.classList.add('cover-page');
  visiblePopup = popup;
  visiblePopup.classList.remove('hidden');
}

export function hidePopup() {
  screenDimmer.classList.remove('cover-page');
  visiblePopup.classList.add('hidden');
}