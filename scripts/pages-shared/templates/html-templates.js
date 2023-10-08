import {
  clipboardIcon,
  removeChar
} from "../../utils/input.js";

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML =
      `<header>
        <h1>Crochet Pattern Generator</h1>
        <nav class="navbar">
          <ul>
            <li><a class="homepage" href="index.html">Home</a></li>
            <li><a class="how-to" href="how-to.html">How To</a></li>
            <li><a class="in-use" href="in-use.html">Use A Pattern</a></li>
            <li class="last"><a class="github-repo" href="https://github.com/codelazarus14/crochet-pattern-js" target="_blank">
              <img src="images/github.svg" alt="Github logo"></a></li>
          </ul>
        </nav>
      </header>`;
  }
}

class Sidebar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML =
      `<div class="sidebar">
        <div class="screen-dimmer js-screen-dimmer" aria-hidden="true"></div>
        <button class="convert-units-button">Convert Units</button>
        ${this.convertUnitsPopup()}
      </div>`;
  }

  convertUnitsPopup() {
    return `<div class="convert-units-popup hidden">
      <div class="popup-header">  
        <h2>Convert Units</h2>
        <button class="close-button js-close-button">${removeChar}</button>
      </div>
      <form class="convert-units-form js-convert-units-form">
        <div class="convert-units">
          <div class="convert-units-input">
            <label class="convert-from-units">Convert from:
              <select class="js-convert-from-units"></select>
            </label>
            <label class="convert-to-units">to:
              <select class="js-convert-to-units"></select>
            </label>
          </div>
          <div class="convert-skeins-input">
            <label class="convert-skeins js-convert-skeins hidden">A skein is:
              <input class="js-convert-skeins-amt" type="number" min="0" step="any">
              <select class="js-convert-skeins-units"></select>
            </label>
          </div>
        </div>
        <div class="convert">
          <div class="convert-from">
            <label class="convert-from-amt">
              <input class="js-convert-from-amt" type="number" min="0" step="any">
              <span class="js-from-units-display"></span>
              <button class="js-copy-from-amt clipboard-icon">${clipboardIcon}</button>
            </label>
          </div>
          <div class="convert-to">
            <label class="convert-to-amt">
              <input class="js-convert-to-amt" type="number" min="0" step="any">
              <span class="js-to-units-display"></span>
              <button class="js-copy-to-amt clipboard-icon">${clipboardIcon}</button>
            </label>
          </div>
        </div>
      </form>
      <!-- used to keep tab navigation from leaving popup -->
      <button class="after-form js-after-form" aria-hidden="true"></button>
    </div>`;
  }
}

class ImagePreview extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = 
    `
    <button class="image-preview-button js-image-preview-button hidden"></button>
    <div class="image-preview-popup js-image-preview-popup hidden">
      <div class="popup-header">
        <h2>Image Preview</h2>
        <button class="close-button js-close-button">${removeChar}</button>
      </div>
      <div class="image-preview-inner">
        <img class="image-preview-content js-image-preview-content" src="" alt="">
      </div>
      <button class="after-form js-after-form" aria-hidden="true"></button>
    </div>`;
  }
}

customElements.define('template-header', Header);
customElements.define('template-sidebar', Sidebar);
customElements.define('template-image-preview', ImagePreview);