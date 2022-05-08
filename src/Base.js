import { LitElement, html, css } from 'lit';

export class Base extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      active: { type: Boolean, reflect: true },
    };
  }
}
