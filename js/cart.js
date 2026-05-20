const PROMO_CODES = {
  'SHOES10': 0.10,
  'SNEAK15':  0.15,
  'NEWDROP':  0.05,
};

let appliedPromo = null;

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  container.querySelectorAll('.cart-item').forEach(el => el.remove());
  const strip = container.querySelector('.continue-strip');
  const cart  = getCart();

  if (cart.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:60px 0;text-align:center;color:var(--muted,#8a8070);font-family:Cormorant Garamond,serif;font-size:1.4rem;font-style:italic;';
    empty.innerHTML = 'Your cart is empty. Explore the collection →<br><a href="collection.html" class="btn" style="margin-top:20px;display:inline-block;">Shop Now</a>';
    container.insertBefore(empty, strip);
    updateItemCount(0);
    return;
  }

  cart.forEach(item => {
    const prod     = PRODUCTS[item.name] || { price: 0, img: 'assets/product1.png', category: 'Footwear' };
    const subtotal = formatINR(prod.price * item.qty);
    const el       = document.createElement('div');
    el.className   = 'cart-item';
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
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path class="wish-heart" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          Save for Later
        </button>
        <p class="item-subtotal">${subtotal}</p>
      </div>
    `;
    container.insertBefore(el, strip);
  });

  restoreWishlistState();
  updateItemCount(cart.reduce((s, i) => s + i.qty, 0));
}

function restoreWishlistState() {
  const wish = getWishlist();
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    const name    = btn.dataset.name;
    const isWished = wish.some(i => (typeof i === 'string' ? i === name : i.name === name));
    btn.classList.toggle('wishlisted', isWished);
  });
}

function updateItemCount(count) {
  const el = document.querySelector('.item-count');
  if (el) el.textContent = `${count} Item${count !== 1 ? 's' : ''}`;
}

function handleCartClick(e) {
  const btn  = e.target.closest('button');
  if (!btn) return;
  const name = btn.dataset.name;

  if (btn.classList.contains('btn-remove')) {
    const row = btn.closest('.cart-item');
    row.style.transition = 'opacity 0.3s, transform 0.3s';
    row.style.opacity    = '0';
    row.style.transform  = 'translateX(20px)';
    setTimeout(() => { removeFromCart(name); renderCartItems(); recalcSummary(); }, 300);
    return;
  }

  if (btn.classList.contains('btn-wishlist')) {
    toggleWishlist(name);
    restoreWishlistState();
    return;
  }

  if (btn.dataset.action === 'inc') {
    updateQty(name, 1);
    renderCartItems();
    recalcSummary();
  }

  if (btn.dataset.action === 'dec') {
    const item = getCart().find(i => i.name === name);
    if (item && item.qty <= 1) {
      const row = btn.closest('.cart-item');
      row.style.transition = 'opacity 0.3s, transform 0.3s';
      row.style.opacity    = '0';
      row.style.transform  = 'translateX(-20px)';
      setTimeout(() => { removeFromCart(name); renderCartItems(); recalcSummary(); }, 300);
    } else {
      updateQty(name, -1);
      renderCartItems();
      recalcSummary();
    }
  }
}

function recalcSummary() {
  const subtotal      = getCartTotal();
  const gst           = Math.round(subtotal * 0.18);
  const promoRate     = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const promoDiscount = Math.round(subtotal * promoRate);
  const shipping      = subtotal >= 5000 ? 0 : 199;
  const total         = subtotal + gst - promoDiscount + shipping;

  const rows = document.querySelectorAll('.summary-row .summary-value');
  if (rows[0]) rows[0].textContent = formatINR(subtotal);
  if (rows[2]) rows[2].textContent = shipping === 0 ? 'Free' : formatINR(shipping);
  if (rows[3]) rows[3].textContent = formatINR(gst);

  const promoRow = document.querySelector('.summary-row:last-of-type .summary-value');
  if (promoRow) promoRow.textContent = promoDiscount > 0 ? `− ${formatINR(promoDiscount)}` : '—';

  const totalEl = document.querySelector('.total-value');
  if (totalEl) {
    totalEl.style.transition = 'color 0.4s';
    totalEl.style.color      = 'var(--gold,#c9a84c)';
    totalEl.textContent      = formatINR(total);
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
  if (getCart().length === 0) { showToast('Your cart is empty!'); return; }
  showToast('Redirecting to checkout… ✦');
  setTimeout(() => {
    alert(`Order placed! Total: ${formatINR(getCartTotal())}\nThank you for shopping at Nishuze ✦`);
  }, 1000);
}

function initCart() {
  if (!document.querySelector('.cart-layout')) return;

  const container = document.querySelector('.cart-items');
  if (container) container.addEventListener('click', handleCartClick);

  renderCartItems();
  recalcSummary();

  const promoInput = document.querySelector('.promo-input');
  const promoBtn   = document.querySelector('.promo-btn');
  if (promoInput && promoBtn) {
    promoInput.removeAttribute('readonly');
    promoInput.value = '';
    promoBtn.addEventListener('click', applyPromo);
    promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') applyPromo(); });
  }

  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

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

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initNav();
  initCart();
});
