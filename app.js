// app.js — simple product render, cart, checkout -> stores orders in Firestore

const PRODUCTS = [
  {id: 'p1', name:'Organic Tomatoes (1kg)', price:80, desc:'Pesticide-free vine tomatoes.'},
  {id: 'p2', name:'Organic Bananas (1 dozen)', price:60, desc:'Ripe & sweet.'},
  {id: 'p3', name:'Organic Spinach (250g)', price:30, desc:'Fresh local spinach.'},
  {id: 'p4', name:'Organic Milk (1L)', price:80, desc:'A2 milk.'}
];

let cart = {};

function $(s){return document.querySelector(s)}

function showToast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'),2500)
}

function renderProducts(){
  const container = $('#products');
  container.innerHTML='';
  PRODUCTS.forEach(p=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML = `<h4>${p.name}</h4>
                     <p>${p.desc}</p>
                     <p>₹${p.price}</p>
                     <button class='btn btn-primary' data-id='${p.id}'>Add</button>`;
    container.appendChild(div);
  });
}

function updateCartUI(){
  const cartList = $('#cartList'); cartList.innerHTML='';
  const ids = Object.keys(cart);
  let total=0; 
  ids.forEach(id=>{
    const item = cart[id]; 
    total += item.qty * item.price;
    const li = document.createElement('li'); 
    li.textContent = ${item.name} x ${item.qty} — ₹${item.qty * item.price};
    cartList.appendChild(li);
  });
  $('#cartTotal').textContent = total;
  $('#cartCount').textContent = ids.reduce((s,id)=>s+cart[id].qty,0);
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!cart[id]) cart[id] = {...p, qty:0};
  cart[id].qty++;
  showToast('Added to cart');
  updateCartUI();
}

function toggleCart(show){
  const d = $('#cartDrawer'); 
  d.classList.toggle('hidden', !show);
}

function getCurrentLocation(){
  if(!navigator.geolocation){ 
    showToast('Location not supported'); 
    return; 
  }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    localStorage.setItem('userLocation', JSON.stringify({latitude, longitude}));
    showToast('Location saved');
  }, ()=> showToast('Location denied'));
}

async function checkout(){
  const items = Object.values(cart);
  if(items.length===0){ showToast('Cart empty'); return; }
  const location = JSON.parse(localStorage.getItem('userLocation')||'null');
  const order = {items, total: Number($('#cartTotal').textContent), createdAt: new Date(), location};
  try{
    if(window.db){
      const ref = await db.collection('orders').add(order);
      showToast('✅ Order placed — ID: '+ref.id);
      cart = {}; 
      updateCartUI(); 
      toggleCart(false);
    }else{
      showToast('Firebase not initialized — check firebase.js');
      console.log('Order object (local):', order);
    }
  }catch(e){
    console.error(e); 
    showToast('❌ Order failed');
  }
}

// Event bindings
window.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(); 
  updateCartUI();
  document.body.addEventListener('click', e=>{
    if(e.target.matches('[data-id]')) addToCart(e.target.dataset.id);
    if(e.target.id==='cartBtn') toggleCart(true);
    if(e.target.id==='checkoutBtn') checkout();
    if(e.target.id==='locBtn') getCurrentLocation();
  });
});
