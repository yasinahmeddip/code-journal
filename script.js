const productsData = [
    { id: 1, name: "MacBook Pro M3 Max", price: 3499.00, category: "MacBooks", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
    { id: 2, name: "Mechanical Gaming Keyboard", price: 129.99, category: "Gadgets", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500" },
    { id: 3, name: "RGB Mood Bar Light", price: 45.00, category: "Lights", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500" },
    { id: 4, name: "MacBook Air 15-inch", price: 1299.00, category: "MacBooks", img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500" },
    { id: 5, name: "Wireless Noise Cancelling Headphones", price: 299.00, category: "Gadgets", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 6, name: "Smart LED Desk Lamp", price: 79.50, category: "Lights", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500" }
];

let cart = JSON.parse(localStorage.getItem('lions_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(productsData);
    updateCartUI();
    setupEventListeners();
    handleWelcomePopup();
});

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <h3>${p.name}</h3>
                <span class="product-price">$${p.price.toFixed(2)}</span>
                <button class="btn-add-cart" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('cartBtn').onclick = toggleCart;
    document.getElementById('closeCart').onclick = toggleCart;
    document.getElementById('overlay').onclick = toggleCart;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.dataset.category;
            renderProducts(cat === 'all' ? productsData : productsData.filter(p => p.category === cat));
        };
    });

    document.getElementById('productSearch').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        renderProducts(productsData.filter(p => p.name.toLowerCase().includes(term)));
    };

    document.querySelectorAll('.close-popup, .close-popup-btn').forEach(b => {
        b.onclick = () => {
            document.getElementById('welcomePopup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        };
    });
}

function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const exists = cart.find(item => item.id === id);
    if (exists) {
        exists.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('lions_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const count = document.getElementById('cartCount');
    const total = document.getElementById('cartTotal');
    
    count.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:20px;">Your cart is empty.</p>';
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex:1">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ef4444; cursor:pointer"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }
    
    const sum = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    total.innerText = `$${sum.toFixed(2)}`;
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    const overlay = document.getElementById('overlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function handleWelcomePopup() {
    if (!sessionStorage.getItem('lions_popup_shown')) {
        setTimeout(() => {
            document.getElementById('welcomePopup').style.display = 'flex';
            document.getElementById('overlay').style.display = 'block';
            sessionStorage.setItem('lions_popup_shown', 'true');
        }, 2000);
    }
}

function scrollToShop() {
    window.scrollTo({ top: 600, behavior: 'smooth' });
}