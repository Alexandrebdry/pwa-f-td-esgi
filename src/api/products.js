import { createRequest } from "./api.js";

const request = createRequest();

export function getProducts() {
  return request.get("/products")
    .then(({ data }) => data)
    .catch(console.error);
}

export function getProduct(productid) {
  return request.get(`/products/${productid}`)
    .then(({ data }) => data)
    .catch(console.error);
}

export async function addToCart(product) {

  const carts = {
    items : [] ,
    total : 0
  } ;

  product['quantity'] = 1 ;
  const currentCart = await getCarts() ;
  if(Object.prototype.hasOwnProperty.call(currentCart,"items")) {

    let test = false ; 
    for(const item of currentCart.items) {
      if(item.id == product.id) {
        item.quantity++ ;
        test = true ;
        break ;
      }
    }

    carts.items.push( currentCart.items );
    if(!test) 
      carts.items.push(product) ;
   
    carts.items = carts.items.flat(Infinity) ;
  
    for(const item of carts.items) {
      carts.total += item.price * item.quantity ;
    }

  } else {
    carts.items.push(product) ;
    carts.items.flat(Infinity) ;
    carts.total = product.price ;
  }
 
  
  return request.put('/cart', carts)
  .then(({   data   }) => data);
}

export async function editProductQuantity(productid, quantity) {
  const carts = await getCarts() ;
  for(const item of carts.items) {
    if(item.id == productid){
      item.quantity = quantity ;
    }
  } 
  carts.total= 0 ;
  for(const item of carts.items) {
    carts.total += item.price * item.quantity ;
  }
  await request.put('cart',carts) ; 
  return carts ;
}

export async function removeProductFromCart(productid) {
  const currentCart = await getCarts() ; 
  const carts = {items:[],total:0} ;

  for(const item of currentCart.items) {
    if(item.id != productid)
      carts.items.push(item) ;
  }
  carts.items = carts.items.flat(Infinity) ;
  for(const item of carts.items) {
    carts.total += item.price * item.quantity ;
  }
  await request.put('cart',carts) ;
  return carts ;
}

export function getCarts() {
  return request.get('/cart')
  .then(({ data }) => data)
    .catch(console.error);
}

export function resetCarts() {
  return request.put('/cart',{})
  .then(({data})=>data) ;
}

export function setCart(cart) {
  return request.put('/cart',cart) 
  .then(({data})=>data) 
}
