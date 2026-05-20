function animateCounter(el) {
  const raw    = el.textContent.replace(/[^0-9]/g, '');
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

function initIndex() {
  if (!document.querySelector('.hero')) return;

  const cards = document.querySelectorAll('.product-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(32px)';
    cardObserver.observe(c);
  });

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(s => statObserver.observe(s));

  cards.forEach(card => {
    const name = card.querySelector('.product-name')?.textContent?.trim();
    if (!name) return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const prod = Object.entries(PRODUCTS).find(([k]) => k === name);
      if (prod) window.location.href = `product.html?name=${encodeURIComponent(name)}`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initNav();
  initIndex();
});
