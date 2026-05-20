function removeFromWishlist(id) {
  saveWish(getWishlist().filter(i => i.id !== id));
  render();
  updateBadges();
  showToast('Removed from wishlist');
}

function moveToCart(item) {
  const cart = getCart();
  const key  = `${item.id}-UK 9-Black`;
  const idx  = cart.findIndex(i => i.key === key);
  if (idx >= 0) { cart[idx].qty++; }
  else cart.push({ key, id: item.id, name: item.name, price: item.price, image: item.image, size: 'UK 9', color: 'Black', qty: 1 });
  saveCart(cart);
  removeFromWishlist(item.id);
  showToast(`${item.name} moved to cart`);
}

function clearAll() {
  saveWish([]);
  render();
  updateBadges();
  showToast('Wishlist cleared');
}

function render() {
  const wish  = getWishlist();
  const el    = document.getElementById('wish-content');
  const count = document.getElementById('wish-count');

  count.textContent = wish.length === 0 ? '' : `${wish.length} item${wish.length > 1 ? 's' : ''} saved`;

  if (wish.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-heart">♡</div>
        <h2>Your Wishlist Is Empty</h2>
        <p>Save the styles you love and find them here anytime.</p>
        <a href="collection.html" class="btn">Browse Collection</a>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="wish-grid">
      ${wish.map(item => `
        <div class="wish-card" id="wish-card-${item.id}">
          <div class="wish-card-img" onclick="location.href='product.html?id=${item.id}'">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="wish-card-body">
            <p class="wish-card-cat">${item.category}</p>
            <p class="wish-card-name" onclick="location.href='product.html?id=${item.id}'">${item.name}</p>
            <p class="wish-card-price">₹${item.price.toLocaleString('en-IN')}</p>
            <div class="wish-card-actions">
              <button class="btn-move-cart" onclick="moveToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">Move to Cart</button>
              <button class="btn-remove-wish" onclick="removeFromWishlist('${item.id}')" title="Remove">✕</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <button class="clear-all" onclick="clearAll()">Clear all wishlist items</button>`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initNav();
  render();
});