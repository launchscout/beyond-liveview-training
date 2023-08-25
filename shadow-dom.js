export class ShadowDomElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      div { color: red; }
      </style>
      <div>I am red</div>
    `;
  }
}

customElements.define('shadow-dom', ShadowDomElement);