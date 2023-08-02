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
        <a href="#">Test 1</a>
        <a href="#">Test 2</a>
        <a href="#">Test 3</a>
        <a href="#">Test 4</a>
      </div>`;
  }
}

customElements.define('template-header', Header);
customElements.define('template-sidebar', Sidebar);