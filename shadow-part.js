export class ShadowPartElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <div part="style-me">I can be styled from the outside</div>
    `;
  }
}

customElements.define('shadow-part', ShadowPartElement);