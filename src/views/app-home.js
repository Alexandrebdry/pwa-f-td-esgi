import { LitElement, html, css } from 'lit';
import { Base } from '../Base';
import "../components/product-card";

export class AppHome extends Base {
  constructor() {
    super();
    this.products = [];
  }
  static get properties() {
    return {
      products: { type: Array }
    }
  }
  render() {
    return this.products.map((product) => html`
      <product-card
        .product="${product}"
      ></product-card>
    `);
  }
}
customElements.define('app-home', AppHome);
