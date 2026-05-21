const SHOES = [
    { id: 1, name: 'Vortex Pro', price: 12999, orig: null, image: 'assets/product1.png', category: 'Sneakers', description: 'Engineered for the streets and the runway. The Vortex Pro fuses premium full-grain leather uppers with our proprietary AirCushion™ midsole. A bold silhouette that doesn\'t compromise on all-day comfort.' },
    { id: 2, name: 'Ember Low', price: 9499, orig: null, image: 'assets/product2.png', category: 'Sneakers', description: 'Low-profile drama. The Ember Low wraps your foot in butter-soft suede with a sculpted gum sole that means business on every surface.' },
    { id: 3, name: 'Mira Slide', price: 5299, orig: null, image: 'assets/product3.png', category: 'Slides', description: 'Slip into effortless. The Mira Slide pairs a contoured cork footbed with a supple leather strap.' },
    { id: 4, name: 'Onyx Boot', price: 12799, orig: 15999, image: 'assets/product4.png', category: 'Boots', description: 'Built for the long haul. Hand-stitched welt construction, waterproof lining, and a Vibram® outsole.' },
    { id: 5, name: 'Drift Sandal', price: 3799, orig: null, image: 'assets/product5.png', category: 'Sandals', description: 'Light as air. Moulded EVA sole with adjustable webbing straps for the perfect warm-weather companion.' },
    { id: 6, name: 'Fitness Streak', price: 4799, orig: null, image: 'assets/product6.png', category: 'Training', description: 'Train harder. Responsive foam midsole and wide toe box — whether on the track or in the gym.' },
    { id: 7, name: 'Pulse Edge', price: 14499, orig: null, image: 'assets/product6.png', category: 'Sneakers', badge: 'Drop', description: 'Limited release. Exaggerated tongue and translucent rubber sole that glows under UV light.' },
    { id: 8, name: 'Regent Cap', price: 11299, orig: null, image: 'assets/product1.png', category: 'Formal', description: 'Command any room. Hand-burnished Italian leather on a leather-lined insole.' },
    { id: 9, name: 'Terra Hike', price: 9799, orig: null, image: 'assets/product2.png', category: 'Outdoor', description: 'Trail-ready toughness meets city style. Ghillie lacing system and aggressive lug sole.' },
    { id: 10, name: 'Nova Flash', price: 18999, orig: null, image: 'assets/product3.png', category: 'Sneakers', description: 'Flagship. Carbon-fibre shank, reflective 3M panelling, and a cushioned wrap collar.' },
    { id: 11, name: 'Solstice Pool', price: 2999, orig: null, image: 'assets/product4.png', category: 'Pool', description: 'Summer distilled. Moulded from a single piece of recycled rubber.' },
    { id: 12, name: 'Vesper Mid', price: 16499, orig: null, image: 'assets/product5.png', category: 'Sneakers', badge: 'New', description: 'Mid-cut profile with nubuck overlays, brass eyelets, and a memory foam sockliner.' },
    { id: 13, name: 'Obsidian Monk', price: 10799, orig: null, image: 'assets/product6.png', category: 'Formal', description: 'Collector\'s piece. Hand-antiqued full-grain leather, single buckle, 1960s Italian craft.' },
];

const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];
const COLORS = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#f0ece4' },
    { name: 'Tan', hex: '#c19a6b' },
    { name: 'Red', hex: '#c0392b' },
];

const pid = parseInt(new URLSearchParams(location.search).get('id') || '1');
const product = SHOES.find(p => p.id === pid) || SHOES[0];
console.log(product)
document.title = 'NISHUZE — ' + product.name;
document.getElementById('pdp-name').textContent = product.name;
document.getElementById('pdp-category').textContent = product.category;
document.getElementById('pdp-price').textContent = '₹' + product.price.toLocaleString('en-IN');
document.getElementById('pdp-description').textContent = product.description;

if (product.orig) {
    const pct = Math.round((product.orig - product.price) / product.orig * 100);
    const el = document.getElementById('pdp-original');
    el.textContent = '₹' + product.orig.toLocaleString('en-IN');
    el.style.display = 'inline';
    const sv = document.getElementById('pdp-save');
    sv.textContent = 'Save ' + pct + '%';
    sv.style.display = 'inline';
}

if (product.badge) {
    const b = document.getElementById('pdp-badge');
    b.textContent = product.badge;
    b.style.display = 'block';
}

const mainImg = document.getElementById('main-img');
const thumbRow = document.getElementById('thumb-row');
const imgs = [product.image, 'assets/product2.png', 'assets/product4.png', 'assets/product5.png'];
mainImg.src = product.image;
imgs.forEach((src, i) => {
    const t = document.createElement('div');
    t.className = 'pdp-thumb' + (i === 0 ? ' active' : '');
    t.innerHTML = '<img src="' + src + '" alt="View ' + (i + 1) + '">';
    t.onclick = () => {
        mainImg.src = src;
        document.querySelectorAll('.pdp-thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
    };
    thumbRow.appendChild(t);
});

let selectedSize = 'UK 9';
SIZES.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'pdp-size' + (s === selectedSize ? ' active' : '');
    btn.textContent = s;
    btn.onclick = () => {
        selectedSize = s;
        document.getElementById('size-selected').textContent = s;
        document.querySelectorAll('.pdp-size').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
    document.getElementById('size-grid').appendChild(btn);
});

let selectedColor = COLORS[0].name;
COLORS.forEach(c => {
    const dot = document.createElement('div');
    dot.className = 'pdp-color' + (c.name === selectedColor ? ' active' : '');
    dot.style.background = c.hex;
    dot.title = c.name;
    dot.onclick = () => {
        selectedColor = c.name;
        document.getElementById('color-selected').textContent = c.name;
        document.querySelectorAll('.pdp-color').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    };
    document.getElementById('color-row').appendChild(dot);
});

const related = SHOES.filter(p => p.id !== product.id).sort(() => 0.5 - Math.random()).slice(0, 4);
document.getElementById('related-grid').innerHTML = related.map(p =>
    '<a class="pdp-rel-card" href="product.html?id=' + p.id + '">' +
    '<div class="pdp-rel-card-img"><img src="' + p.image + '" alt="' + p.name + '"></div>' +
    '<p class="pdp-rel-name">' + p.name + '</p>' +
    '<p class="pdp-rel-price">₹' + p.price.toLocaleString('en-IN') + '</p>' +
    '</a>'
).join('');

function getCart() { try { return JSON.parse(localStorage.getItem('nishuze_cart') || '[]'); } catch (e) { return []; } }
function getWishlist() { try { return JSON.parse(localStorage.getItem('nishuze_wish') || '[]'); } catch (e) { return []; } }
function saveCart(c) { localStorage.setItem('nishuze_cart', JSON.stringify(c)); }
function saveWish(w) { localStorage.setItem('nishuze_wish', JSON.stringify(w)); }

function updateBadges() {
    document.getElementById('cart-badge').textContent = getCart().reduce((s, i) => s + i.qty, 0);
    document.getElementById('wish-badge').textContent = getWishlist().length;
}
updateBadges();

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

function addToCart() {
    const cart = getCart();
    const key = product.id + '-' + selectedSize + '-' + selectedColor;
    const idx = cart.findIndex(i => i.key === key);
    if (idx >= 0) { cart[idx].qty++; }
    else cart.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, size: selectedSize, color: selectedColor, qty: 1 });
    saveCart(cart);
    updateBadges();
    const btn = document.getElementById('add-cart-btn');
    btn.textContent = '✓ ADDED';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'ADD TO CART'; btn.classList.remove('added'); }, 1800);
    showToast(product.name + ' added to cart');
}

function toggleWishlist() {
    const wish = getWishlist();
    const btn = document.getElementById('wish-btn');
    const idx = wish.findIndex(i => i.id === product.id);
    if (idx >= 0) {
        wish.splice(idx, 1);
        btn.textContent = '♡';
        btn.classList.remove('wishlisted');
        showToast('Removed from wishlist');
    } else {
        wish.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
        btn.textContent = '♥';
        btn.classList.add('wishlisted');
        showToast(product.name + ' saved to wishlist');
    }
    saveWish(wish);
    updateBadges();
}

if (getWishlist().find(i => i.id === product.id)) {
    const btn = document.getElementById('wish-btn');
    btn.textContent = '♥';
    btn.classList.add('wishlisted');
}

function toggleAcc(hd) {
    const body = hd.nextElementSibling;
    const isOpen = body.classList.contains('open');
    document.querySelectorAll('.pdp-acc-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.pdp-acc-hd').forEach(h => h.classList.remove('open'));
    if (!isOpen) { body.classList.add('open'); hd.classList.add('open'); }
}

document.addEventListener('DOMContentLoaded', () => {

    const pid = parseInt(new URLSearchParams(location.search).get('id') || '1');
    const product = SHOES.find(p => p.id === pid) || SHOES[0];

    console.log(product);

    document.title = 'NISHUZE — ' + product.name;
    document.getElementById('pdp-name').textContent = product.name;
    document.getElementById('pdp-category').textContent = product.category;
    document.getElementById('pdp-price').textContent =
        '₹' + product.price.toLocaleString('en-IN');

    document.getElementById('pdp-description').textContent =
        product.description;

});