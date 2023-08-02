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
            <li><a class="how-to" href="how-to.html">How To Use</a></li>
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
        <div class="screen-dimmer"></div>
        <button class="convert-units-button js-convert-units-button">Convert Units</button>
        ${this.convertUnitsPopup()}
      </div>`;
  }

  convertUnitsPopup() {
    return `<div class="convert-units-popup js-convert-units-popup hidden">
      <div class="popup-header">  
        <h2>Convert Units</h2>
        <button class="close-button js-close-button">${removeChar}</button>
      </div>
      <form class="convert-units-form js-convert-units-form">
        <label class="convert-from">Convert from:       
          <div class="convert-from-inputs"> 
            <input class="js-convert-from-amt" type="number" min="0">
            <select class="js-convert-from-units"></select>
            <button class="clipboard-icon">${clipboardIcon}</button>
          </div>
        </label>
        <label class="convert-to">to:
          <div class="convert-to-inputs">
            <input class="js-convert-to-amt" type="number" min="0">
            <select class="js-convert-to-units"></select>             
            <button class="clipboard-icon">${clipboardIcon}</button>
          </div>
        </label>
      </form>
      <!-- used to keep tab navigation from leaving popup -->
      <button class="after-form js-after-form"></button>
    </div>`;
  }
}

customElements.define('template-header', Header);
customElements.define('template-sidebar', Sidebar);