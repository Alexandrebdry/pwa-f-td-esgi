import page from "page";
import checkConnectivity from "network-latency";

import { getProducts, getProduct, getCarts, resetCarts, setCart } from './api/products';
import "./views/app-home";
import { getRessource, getRessources, setRessource, setRessources } from "./idbHelpers";

(async (root) => {

  const skeleton = root.querySelector('.skeleton');
  const main = root.querySelector('main');

  const AppHome = main.querySelector('app-home');
  const AppProduct = main.querySelector('app-product');
  const AppCart = main.querySelector("app-cart") ;

  checkConnectivity({
    interval: 3000,
    threshold: 2000
  });

  let NETWORK_STATE = true;

  document.addEventListener('connection-changed', async ({ detail }) => {
    NETWORK_STATE = detail;
    if (NETWORK_STATE) {
      document.documentElement.style.setProperty('--app-bg-color', 'royalblue');
      AppCart.state = true ; 
      let currentCart = await getCarts() ; 
      let offlineCart = await getRessource(1,'Cart') ; 
      if(Object.prototype.hasOwnProperty.call(offlineCart,'total')) {
        if(currentCart?.total != offlineCart.total) {
          await resetCarts().then(await setCart(offlineCart) ) ; 
        }
      }
    } else {
      document.documentElement.style.setProperty('--app-bg-color', '#717276');
      AppCart.state = false ;
    }
  });

 

  page('*', (ctx, next) => {
    skeleton.removeAttribute('hidden');

    AppHome.active = false;
    AppProduct.active = false;
    AppCart.active = false ;

    next();
  });

  page('/', async () => {
    let storedproducts = []
    if (NETWORK_STATE) {
      const products = await getProducts();
      storedproducts = await setRessources(products);
    } else {
      storedproducts = await getRessources();
    }

    AppHome.products = storedproducts;
    AppHome.active = true;

    skeleton.setAttribute('hidden', 'hiddle');
  });

  page('/product/:id', async ({ params }) => {
    await import('./views/app-product');
    
    let storedProduct = {};
    if (NETWORK_STATE) {
      const product = await getProduct(params.id);
      storedProduct = await setRessource(product);
    } else {
      storedProduct = await getRessource(params.id);
    }

    AppProduct.product = storedProduct;
    AppProduct.active = true;

    skeleton.setAttribute('hidden', 'hiddle');
  });

  page('/cart', async () => {
    await import('./views/app-cart');

    let carts = [] ; 
    if(NETWORK_STATE) {
      const cart = await getCarts() ; 
      cart['id'] = 1 ; 
      cart['category'] = 'cart' ; 
      carts = await setRessource(cart,'Cart') ;
    } else {
      carts = await getRessource(1,'Cart') ; 
    }

    AppCart.products = carts ;  
    AppCart.state = NETWORK_STATE ;
    AppCart.active = true ; 

    skeleton.setAttribute('hidden', 'hiddle');
  }) ;

  page();

})(document.querySelector('#app'));