import { html } from 'lit';
import { Base } from '../Base';
import { addToCart, getProduct } from '../api/products';
import { getRessource, setRessource } from '../idbHelpers';

export class ProductCard extends Base {
  constructor() {
    super();

    this.product = {};

    this.loaded = false;
  }

  static get properties() {
    return {
      product: { type: Object },
      loaded: { type: Boolean, state: true }
    };
  }

  firstUpdated() {
    const img = this.querySelector('img');
    img.addEventListener('load', () => {
      this.loaded = true;
    });
  }

  render() {
    return html`
      <div class="card">
      <a href="/product/${this.product.id}" class="card">
        <header>
          <figure>
            <div class="placeholder ${this.loaded ? "fade": ""}" style="background-image: url(http://localhost:9000/image/24/${this.product.image})"></div>
            <img src="${this.product.image}" alt="${this.product.title}" loading="lazy">
          </figure>
        </header>
        <main>
          <h1>${this.product.title}</h1>
          <p>${this.product.description}</p>
        </main>
      </a>
      <button @click="${this._addProductToCart}">Ajouter au panier</button>
      </div>
    `;
  }

  async _addProductToCart() {

    const main = document.querySelector('main');
    const AppCart = main.querySelector("app-cart") ;

    if(AppCart.state) {
      const cart = await addToCart(await getProduct(this.product.id)) ; 
      cart['id'] = 1 ;
      cart['categoy'] = 'cart' ;
      setRessource (cart,'Cart') ;
    } 
    else {

      const cart = await getRessource(1,'Cart') ;
      this.product['quantity'] = 1 ; 

      let isPresent = false ;
      for(const item of cart.items) {
        if(item.id == this.product.id){
          item.quantity++ ; 
          isPresent = true ;
        }
      }

      if(!isPresent) cart.items.push(this.product) ; 
      cart.items = cart.items.flat(Infinity) ;

      for(const item of cart.items) {
        cart.total += item.price*item.quantity ;
      }

      await setRessource(cart,'Cart') ;
    }
  }
}
customElements.define('product-card', ProductCard);