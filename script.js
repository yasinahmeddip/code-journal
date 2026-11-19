let products = [];
let cart = JSON.parse(localStorage.getItem('lions_cart')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderProducts(products);
    updateCartUI();
    
    if (!localStorage.getItem('popupShown')) {
        setTimeout(() => {
            document.getElementById('welcomePopup').style.display = 'flex';
        }, 2000);
    }

    document.getElementById('productSearch').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });
});

async function loadData() {
    try {
        const response = await fetch('data.json');
        products = await response.json();
    } catch (e) {
        console.error('Data failed to load', e);
    }
}

function renderProducts(list) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = list.map(p => `
        <div class="product-card">
            <img src="${p.image}" onerror="this.src='https://placehold.co/400x300/1a1a1a/f59e0b?text=Lions+Electro'" alt="${p.name}">
            <div class="product-info">
                <h4>${p.name}</h4>
                <p class="price">$${p.price}</p>
                <button class="cta-btn" style="width:100%; margin-top:10px" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function filterProducts(cat) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderProducts(filtered);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('lions_cart', JSON.stringify(cart));
    updateCartUI();
    toggleCart(true);
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const totalPrice = document.getElementById('totalPrice');
    
    cartCount.innerText = cart.length;
    cartItems.innerHTML = cart.map((item, index) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px">
            <span>${item.name}</span>
            <span>$${item.price} <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer">×</button></span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.innerText = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('lions_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cartDrawer');
    if (forceOpen) drawer.classList.add('open');
    else drawer.classList.toggle('open');
}

function closePopup() {
    document.getElementById('welcomePopup').style.display = 'none';
    localStorage.setItem('popupShown', 'true');
}

function scrollToProducts() {
    document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
}