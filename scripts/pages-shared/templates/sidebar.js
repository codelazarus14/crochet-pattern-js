import { renderConvertUnitsPopup } from "../popups/convert-units.js";
import {
  enableScreenDimmer,
  hidePopup,
  showPopup
} from "../popups/popup.js";

const sidebar = document.querySelector(".sidebar");
// Get the offset position of the sidebar
const sticky = sidebar.offsetTop - 12;

enableScreenDimmer();
addSidebarListeners();
renderConvertUnitsPopup();

function addSidebarListeners() {
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

  sidebar.querySelectorAll('.js-after-form')
    .forEach(after => {
      after.addEventListener('focus', () => {
        // loop tab navigation back to top
        const closeButton = after.parentElement.querySelector('.js-close-button');
        closeButton.focus();
      });
    });
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