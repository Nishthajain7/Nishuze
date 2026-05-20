function syncWishlistButtons() {
  const list = getWishlist();
  document.querySelectorAll('.btn-wish[data-name]').forEach(btn => {
    const wished = list.some(i => (typeof i === 'string' ? i === btn.dataset.name : i.name === btn.dataset.name));
    btn.textContent = wished ? '♥' : '♡';
    btn.classList.toggle('wishlisted', wished);
  });
}
function goProduct(id) { location.href = `product.html?id=${id}`; }

function getWishlist() { try { return JSON.parse(localStorage.getItem('nishuze_wish') || '[]'); } catch (e) { return []; } }
function saveWish(w) { localStorage.setItem('nishuze_wish', JSON.stringify(w)); }
function getCart() { try { return JSON.parse(localStorage.getItem('nishuze_cart') || '[]'); } catch (e) { return []; } }

function updateBadges() {
  document.getElementById('wish-badge').textContent = getWishlist().length;
  document.getElementById('cart-badge').textContent = getCart().reduce((s, i) => s + i.qty, 0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function toggleWish(e, id, name, price, image, category) {
  e.stopPropagation();
  const wish = getWishlist();
  const btn = e.currentTarget;
  const idx = wish.findIndex(i => i.id === id);
  if (idx >= 0) {
    wish.splice(idx, 1);
    btn.textContent = '♡';
    btn.classList.remove('wishlisted');
    showToast(`Removed from wishlist`);
  } else {
    wish.push({ id, name, price, image, category });
    btn.textContent = '♥';
    btn.classList.add('wishlisted');
    showToast(`${name} added to wishlist`);
  }
  saveWish(wish);
  updateBadges();
}

(function () {
  const wish = getWishlist();
  wish.forEach(item => {
    const card = document.querySelector(`.product-card[data-id="${item.id}"]`);
    if (card) {
      const btn = card.querySelector('.btn-wish');
      if (btn) { btn.textContent = '♥'; btn.classList.add('wishlisted'); }
    }
  });
  updateBadges();
})();

function initCollection() {
  if (!document.querySelector('.collection-grid')) return;

  document.querySelectorAll('.btn-add').forEach(btn => {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.card-name')?.textContent?.trim();
    if (!name || name === 'Obsidian Monk') return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `product.html?name=${encodeURIComponent(name)}`;
    });
  });

  document.querySelectorAll('.btn-wish').forEach(btn => {
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.card-name')?.textContent?.trim();
    if (!name) return;
    btn.dataset.name = name;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(name);
      syncWishlistButtons();
    });
  });

  syncWishlistButtons();

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.zIndex = '10');
    card.addEventListener('mouseleave', () => card.style.zIndex = '');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(e.target.parentElement?.children || []).indexOf(e.target);
        setTimeout(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
        }, idx * 60);
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

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initNav();
  initCollection();
});
