class GrayBox extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        div { background-color: gray; width: 200px; height: 150px; }
      </style>
      <div><slot></slot><div>
    `;
  }
}

customElements.define('gray-box', GrayBox);