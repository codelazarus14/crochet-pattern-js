import {
  addPopupListeners
} from "./popup.js"

const imagePreviewPopup = document.querySelector('.js-image-preview-popup');
const imagePreviewContent = imagePreviewPopup.querySelector('.js-image-preview-content');
const imagePreviewButton = imagePreviewPopup.previousElementSibling;
const closeImagePreviewButton = imagePreviewPopup.querySelector('.js-close-button');
const afterListElem = imagePreviewPopup.querySelector('.js-after-form');

addPopupListeners([imagePreviewButton], [closeImagePreviewButton], [afterListElem]);

export function addImagePreviewListeners(element) {
  element.querySelectorAll('.open-image-preview').forEach(imageContainer => {
    imageContainer.addEventListener('click', () => {
      const img = imageContainer.querySelector('img');
      imagePreviewContent.setAttribute('src', img.getAttribute('src'));
      imagePreviewContent.setAttribute('alt', img.getAttribute('alt'));
      imagePreviewButton.click();
    });
  });
}
