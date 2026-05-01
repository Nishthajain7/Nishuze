/**
 * NISHUZE — script.js
 * Covers: index.html, collection.html, cart.html, login.html
 * Drop this file in your project root and add <script src="script.js"></script>
 * before </body> on every page.
 */

/* ============================================================
   1. CART STATE — persisted in localStorage
   ============================================================ */
const CART_KEY = 'nishuze_cart';

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
  updateCartBadge();
  showToast(`${name} added to cart ✦`);
}

function removeFromCart(name) {
  const cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
  updateCartBadge();
}

function updateQty(name, delta) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      // qty hit 0 — remove the item entirely
      cart = cart.filter(i => i.name !== name);
    }
    saveCart(cart);
  }
  updateCartBadge();
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

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = getCartCount();
    el.style.transform = 'scale(1.35)';
    setTimeout(() => el.style.transform = 'scale(1)', 220);
  });
}

/* ============================================================
   2. TOAST NOTIFICATION
   ============================================================ */
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

/* ============================================================
   3. WISHLIST STATE
   ============================================================ */
const WISH_KEY = 'nishuze_wishlist';

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
  catch { return []; }
}

function toggleWishlist(name) {
  const list = getWishlist();
  const idx = list.indexOf(name);
  if (idx === -1) {
    list.push(name);
    showToast(`${name} saved to wishlist ♡`);
  } else {
    list.splice(idx, 1);
    showToast(`${name} removed from wishlist`);
  }
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  syncWishlistButtons();
}

function syncWishlistButtons() {
  const list = getWishlist();
  document.querySelectorAll('.btn-wish[data-name]').forEach(btn => {
    btn.textContent = list.includes(btn.dataset.name) ? '♥' : '♡';
    btn.style.color = list.includes(btn.dataset.name) ? 'var(--rust,#b84a2e)' : '';
  });
}

/* ============================================================
   4. NAV — sticky scroll effect
   ============================================================ */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.background = y > 60
      ? 'rgba(10,10,10,0.96)'
      : 'transparent';
    nav.style.backdropFilter = y > 60 ? 'blur(12px)' : 'none';
    nav.style.boxShadow = y > 60 ? '0 1px 0 rgba(201,168,76,0.15)' : 'none';
    lastY = y;
  }, { passive: true });
}

/* ============================================================
   5. INDEX PAGE
   ============================================================ */
function initIndex() {
  if (!document.querySelector('.hero')) return;

  // Scroll-reveal for product cards
  const cards = document.querySelectorAll('.product-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(32px)';
    observer.observe(c);
  });

  // Stat counter animation
  const stats = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => statObserver.observe(s));

  // Wire up homepage product cards — Add to Cart on click
  document.querySelectorAll('.product-card').forEach(card => {
    const name = card.querySelector('.product-name')?.textContent?.trim();
    if (!name) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => addToCart(name));
  });
}

function animateCounter(el) {
  const raw = el.textContent.replace(/[^0-9]/g, '');
  const suffix = el.textContent.replace(/[0-9]/g, '').trim();
  const target = parseInt(raw, 10);
  if (!target) return;
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('en-IN') + suffix;
    if (current >= target) clearInterval(interval);
  }, 20);
}

/* ============================================================
   6. COLLECTION PAGE
   ============================================================ */
function initCollection() {
  if (!document.querySelector('.collection-grid')) return;

  // Wire Add to Cart buttons
  document.querySelectorAll('.btn-add').forEach(btn => {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.card-name')?.textContent?.trim();
    if (!name || name === 'Obsidian Monk') return; // sold out

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(name);
      btn.textContent = 'Added ✦';
      btn.style.background = 'var(--gold,#c9a84c)';
      btn.style.color = 'var(--black,#0a0a0a)';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
    });
  });

  // Wire wishlist buttons
  document.querySelectorAll('.btn-wish').forEach(btn => {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.card-name')?.textContent?.trim();
    if (!name) return;
    btn.dataset.name = name;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(name);
    });
  });

  syncWishlistButtons();

  // Card hover — subtle lift via JS for consistency
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // Scroll-reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
        }, (Array.from(e.target.parentElement?.children || []).indexOf(e.target)) * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.product-card').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(24px) scale(0.97)';
    c.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(c);
  });
}

/* ============================================================
   7. CART PAGE
   ============================================================ */

const PROMO_CODES = {
  'NSHUZE10': 0.10,
  'NISHU15':  0.15,
  'NEWDROP':  0.05,
};

let appliedPromo = null;

function initCart() {
  if (!document.querySelector('.cart-layout')) return;

  // ── 1. Wipe ALL hardcoded static cart-item elements from the HTML ──
  document.querySelectorAll('.cart-item').forEach(el => el.remove());

  // ── 2. Attach a SINGLE delegated click listener on the container ──
  const container = document.querySelector('.cart-items');
  if (container) container.addEventListener('click', handleCartClick);

  // ── 3. Render from localStorage & calc totals ──
  renderCartItems();
  recalcSummary();

  // Promo code
  const promoInput = document.querySelector('.promo-input');
  const promoBtn   = document.querySelector('.promo-btn');
  if (promoInput && promoBtn) {
    promoInput.removeAttribute('readonly');
    promoInput.value = '';
    promoBtn.addEventListener('click', applyPromo);
    promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyPromo(); });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  // Upsell "Add to Cart" buttons
  document.querySelectorAll('.upsell-add').forEach(btn => {
    const name = btn.closest('.upsell-card')?.querySelector('.upsell-name')?.textContent?.trim();
    if (!name) return;
    btn.addEventListener('click', () => {
      addToCart(name);
      renderCartItems();
      recalcSummary();
      btn.textContent = 'Added ✦';
      setTimeout(() => btn.textContent = '+ Add to Cart', 1800);
    });
  });
}

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  const cart = getCart();

  // Remove existing dynamic items (keep the .continue-strip)
  container.querySelectorAll('.cart-item').forEach(el => el.remove());

  const strip = container.querySelector('.continue-strip');

  if (cart.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:60px 0; text-align:center; color:var(--muted,#8a8070); font-family:Cormorant Garamond,serif; font-size:1.4rem; font-style:italic;';
    empty.textContent = 'Your cart is empty. Explore the collection →';
    empty.innerHTML += '<br><a href="collection.html" class="btn" style="margin-top:20px;display:inline-block;">Shop Now</a>';
    container.insertBefore(empty, strip);
    updateItemCount(0);
    return;
  }

  cart.forEach(item => {
    const prod = PRODUCTS[item.name] || { price: 0, img: 'assets/product1.png', category: 'Footwear' };
    const subtotal = formatINR(prod.price * item.qty);

    const el = document.createElement('div');
    el.className = 'cart-item';
    el.dataset.name = item.name;
    el.innerHTML = `
      <div class="item-img">
        <img src="${prod.img}" alt="${item.name}" />
      </div>
      <div class="item-details">
        <p class="item-category">${prod.category}</p>
        <p class="item-name">${item.name}</p>
        <div class="item-meta">
          <span>Size: ${item.size || 'UK 9'}</span>
          <span>Color: ${item.color || 'Default'}</span>
        </div>
        <div class="item-qty">
          <button class="qty-btn" data-action="dec" data-name="${item.name}">−</button>
          <div class="qty-val">${item.qty}</div>
          <button class="qty-btn" data-action="inc" data-name="${item.name}">+</button>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-remove" data-name="${item.name}">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Remove
        </button>
        <button class="btn-wishlist" data-name="${item.name}">
          <svg viewBox="0 0 24 24" width="12" height="12"><path fill="red" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Save for Later
        </button>
        <p class="item-subtotal">${subtotal}</p>
      </div>
    `;
    container.insertBefore(el, strip);
  });

  updateItemCount(cart.reduce((s, i) => s + i.qty, 0));
}

function handleCartClick(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const name = btn.dataset.name;

  if (btn.classList.contains('btn-remove')) {
    const item = btn.closest('.cart-item');
    item.style.transition = 'opacity 0.3s, transform 0.3s';
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    setTimeout(() => {
      removeFromCart(name);
      renderCartItems();
      recalcSummary();
    }, 300);
    return;
  }

  if (btn.classList.contains('btn-wishlist')) {
    toggleWishlist(name);
    return;
  }

  if (btn.dataset.action === 'inc') {
    updateQty(name, 1);
    renderCartItems();
    recalcSummary();
  }

  if (btn.dataset.action === 'dec') {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (item && item.qty <= 1) {
      // Qty would hit 0 — animate out then remove
      const row = btn.closest('.cart-item');
      if (row) {
        row.style.transition = 'opacity 0.3s, transform 0.3s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          removeFromCart(name);
          renderCartItems();
          recalcSummary();
        }, 300);
      }
    } else {
      updateQty(name, -1);
      renderCartItems();
      recalcSummary();
    }
  }
}

function updateItemCount(count) {
  const el = document.querySelector('.item-count');
  if (el) el.textContent = `${count} Item${count !== 1 ? 's' : ''}`;
}

function recalcSummary() {
  const cart = getCart();
  const subtotal = getCartTotal();
  const gstRate  = 0.18;
  const promoRate = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const promoDiscount = Math.round(subtotal * promoRate);
  const gst  = Math.round(subtotal * gstRate);
  const total = subtotal + gst - promoDiscount;

  const rows = document.querySelectorAll('.summary-row .summary-value');
  // rows[0] = subtotal, rows[1] = discount, rows[2] = shipping, rows[3] = gst
  if (rows[0]) rows[0].textContent = formatINR(subtotal);
  if (rows[2]) rows[2].textContent = subtotal >= 5000 ? 'Free' : formatINR(199);
  if (rows[3]) rows[3].textContent = formatINR(gst);

  // Promo row
  const promoRow = document.querySelector('.summary-row:last-of-type .summary-value');
  if (promoRow) promoRow.textContent = promoDiscount > 0 ? `− ${formatINR(promoDiscount)}` : '—';

  const totalEl = document.querySelector('.total-value');
  if (totalEl) {
    totalEl.style.transition = 'color 0.4s';
    totalEl.style.color = 'var(--gold,#c9a84c)';
    totalEl.textContent = formatINR(total + (subtotal >= 5000 ? 0 : 199));
    setTimeout(() => totalEl.style.color = '', 600);
  }
}

function applyPromo() {
  const input = document.querySelector('.promo-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (PROMO_CODES[code]) {
    appliedPromo = code;
    const pct = Math.round(PROMO_CODES[code] * 100);
    showToast(`${code} applied — ${pct}% off! ✦`);
    input.style.borderColor = 'var(--gold,#c9a84c)';

    const badge = document.querySelector('.promo-applied');
    if (badge) badge.textContent = `✦ ${code} — ${pct}% off applied`;

    recalcSummary();
  } else {
    showToast('Invalid promo code');
    input.style.borderColor = 'var(--rust,#b84a2e)';
    setTimeout(() => input.style.borderColor = '', 1500);
  }
}

function handleCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  showToast('Redirecting to checkout… ✦');
  // In a real app, redirect to checkout page
  setTimeout(() => {
    alert(`Order placed! Total: ${formatINR(getCartTotal())}\nThank you for shopping at Nishuze ✦`);
  }, 1000);
}

/* ============================================================
   8. LOGIN PAGE
   ============================================================ */
function initLogin() {
  // Tab switching is inline in login.html; we enhance it here
  if (!document.querySelector('.right-panel')) return;

  // Enhanced login handler
  const loginBtn = document.querySelector('#form-login .btn-submit');
  if (loginBtn) {
    loginBtn.onclick = handleLogin;
  }

  // Enhanced signup
  const signupBtn = document.querySelector('#form-signup .btn-submit');
  if (signupBtn) {
    signupBtn.onclick = handleSignup;
  }

  // Forgot password
  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', e => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      if (email) {
        showToast(`Reset link sent to ${email} ✦`);
      } else {
        showToast('Enter your email first');
      }
    });
  }
}

function handleLogin() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pass  = document.getElementById('login-pass')?.value;

  if (!email || !pass) {
    showToast('Please fill in all fields');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Enter a valid email address');
    return;
  }
  if (pass.length < 6) {
    showToast('Password too short');
    return;
  }

  const btn = document.querySelector('#form-login .btn-submit');
  if (btn) {
    btn.textContent = 'Signing In…';
    btn.disabled = true;
  }

  setTimeout(() => {
    localStorage.setItem('nishuze_user', JSON.stringify({ email }));
    showToast(`Welcome back! ✦`);
    setTimeout(() => window.location.href = 'index.html', 1200);
  }, 1000);
}

function handleSignup() {
  const first = document.getElementById('first')?.value?.trim();
  const last  = document.getElementById('last')?.value?.trim();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pass  = document.getElementById('signup-pass')?.value;
  const agree = document.getElementById('agree')?.checked;

  if (!first || !last || !email || !pass) {
    showToast('Please fill in all fields');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Enter a valid email address');
    return;
  }
  if (pass.length < 8) {
    showToast('Password must be at least 8 characters');
    return;
  }
  if (!agree) {
    showToast('Please accept the Terms & Privacy Policy');
    return;
  }

  const btn = document.querySelector('#form-signup .btn-submit');
  if (btn) {
    btn.textContent = 'Creating Account…';
    btn.disabled = true;
  }

  setTimeout(() => {
    localStorage.setItem('nishuze_user', JSON.stringify({ email, name: first }));
    showToast(`Welcome to Nishuze, ${first}! ✦`);
    setTimeout(() => window.location.href = 'index.html', 1200);
  }, 1000);
}

/* ============================================================
   9. UTILITIES
   ============================================================ */
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   10. GLOBAL INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initNav();
  initIndex();
  initCollection();
  initCart();
  initLogin();
});