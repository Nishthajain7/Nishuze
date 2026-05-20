const CART_KEY = 'nishuze_cart';
const WISH_KEY = 'nishuze_wish';

const PRODUCTS = {
  'Vortex Pro':    { price: 12999, img: 'assets/product1.png', category: 'Sneakers' },
  'Ember Low':     { price: 9499,  img: 'assets/product2.png', category: 'Sneakers' },
  'Onyx Boot':     { price: 12799, img: 'assets/product3.png', category: 'Boots'    },
  'Mira Slide':    { price: 5299,  img: 'assets/product4.png', category: 'Slides'   },
  'Drift Sandal':  { price: 3799,  img: 'assets/product5.png', category: 'Sandals'  },
  'Pulse Edge':    { price: 14499, img: 'assets/product6.png', category: 'Sneakers' },
  'Regent Cap':    { price: 11299, img: 'assets/product1.png', category: 'Sneakers' },
  'Terra Hike':    { price: 9799,  img: 'assets/product2.png', category: 'Boots'    },
  'Nova Flash':    { price: 18999, img: 'assets/product3.png', category: 'Sneakers' },
  'Solstice Pool': { price: 2999,  img: 'assets/product4.png', category: 'Slides'   },
  'Vesper Mid':    { price: 16499, img: 'assets/product5.png', category: 'Boots'    },
  'Fitness Streak':{ price: 4799,  img: 'assets/product6.png', category: 'Sneakers' },
};

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name, qty, size: 'UK 9', color: 'Default' });
  }
  saveCart(cart);
  updateBadges();
  showToast(`${name} added to cart ✦`);
}

function removeFromCart(name) {
  saveCart(getCart().filter(i => i.name !== name));
  updateBadges();
}

function updateQty(name, delta) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
    saveCart(cart);
  }
  updateBadges();
}

function getCartTotal() {
  return getCart().reduce((sum, i) => {
    const p = PRODUCTS[i.name];
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
  catch { return []; }
}

function saveWish(w) {
  localStorage.setItem(WISH_KEY, JSON.stringify(w));
}

function toggleWishlist(name) {
  const list = getWishlist();
  const idx  = list.findIndex(i => (typeof i === 'string' ? i === name : i.name === name));
  if (idx === -1) {
    const prod = PRODUCTS[name];
    list.push({ id: name, name, price: prod?.price || 0, image: prod?.img || '', category: prod?.category || '' });
    showToast(`${name} saved to wishlist ♡`);
  } else {
    list.splice(idx, 1);
    showToast(`${name} removed from wishlist`);
  }
  saveWish(list);
  updateBadges();
}

function updateBadges() {
  const cartCount = getCartCount();
  const wishCount = getWishlist().length;

  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = cartCount;
    el.style.transform = 'scale(1.35)';
    setTimeout(() => el.style.transform = 'scale(1)', 220);
  });

  document.querySelectorAll('.wish-badge, #wish-badge').forEach(el => {
    el.textContent = wishCount;
  });
}

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(msg, duration = 2800) {
  let toast = document.getElementById('nz-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nz-toast';
    toast.style.cssText = `
      position:fixed; bottom:32px; left:50%; transform:translateX(-50%) translateY(20px);
      background:var(--gold,#c9a84c); color:var(--black,#0a0a0a);
      font-family:'Space Mono',monospace; font-size:0.72rem; letter-spacing:0.18em;
      text-transform:uppercase; padding:14px 28px; z-index:9999;
      opacity:0; transition:opacity 0.3s, transform 0.3s; pointer-events:none;
      white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, duration);
}

function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.background      = y > 60 ? 'rgba(10,10,10,0.96)' : 'transparent';
    nav.style.backdropFilter  = y > 60 ? 'blur(12px)' : 'none';
    nav.style.boxShadow       = y > 60 ? '0 1px 0 rgba(201,168,76,0.15)' : 'none';
  }, { passive: true });
}
