import { renderConvertUnitsPopup } from "../popups/convert-units.js";
import {
  enableScreenDimmer,
  addPopupListeners
} from "../popups/popup.js";

const sidebar = document.querySelector(".sidebar");
// Get the offset position of the sidebar
const sticky = sidebar.offsetTop - 12;

enableScreenDimmer();
addSidebarListeners();
renderConvertUnitsPopup();

function addSidebarListeners() {
  const popupButtons = sidebar.querySelectorAll('.sidebar > button');
  const closePopupButtons = sidebar.querySelectorAll('.js-close-button');
  const afterFormElems = sidebar.querySelectorAll('.js-after-form');

  addPopupListeners(popupButtons, closePopupButtons, afterFormElems);
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