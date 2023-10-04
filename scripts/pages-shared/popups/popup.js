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

export function addPopupListeners(popupButtons, closeButtons, afterFormElems, onPopupOpen) {
  popupButtons.forEach(popupButton => {
    popupButton.addEventListener('click', () => {
      showPopup(popupButton.nextElementSibling);
      if (onPopupOpen) onPopupOpen();
    });
  });

  closeButtons.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
      hidePopup();
    });
  });

  afterFormElems.forEach(after => {
    after.addEventListener('focus', () => {
      // loop tab navigation back to top
      const closeButton = after.parentElement.querySelector('.js-close-button');
      closeButton.focus();
    });
  });
}