const products = [
    { id: 1, name: "MacBook Pro M3 Max", price: 3499.99, cat: "macbook", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
    { id: 2, name: "Aura RGB Smart Lamp", price: 89.00, cat: "lights", img: "https://images.unsplash.com/photo-1534073828943-f801091bb18c" },
    { id: 3, name: "Mechanical Keyboard G Pro", price: 129.50, cat: "gadgets", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae" },
    { id: 4, name: "Thunderbolt Hub v4", price: 210.00, cat: "gadgets", img: "https://images.unsplash.com/photo-1591488320449-011701bb6704" },
    { id: 5, name: "Nanoleaf Shape Panels", price: 199.99, cat: "lights", img: "https://images.unsplash.com/photo-1550537687-c91072c4792d" },
    { id: 6, name: "MacBook Air M2", price: 1099.00, cat: "macbook", img: "https://images.unsplash.com/photo-1611186871348-b1ec696e52c9" }
];

let cart = JSON.parse(localStorage.getItem('lions_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    
    if (!localStorage.getItem('visited_lions')) {
        setTimeout(() => document.getElementById('welcomePopup').classList.remove('hidden'), 2000);
    }

    document.getElementById('closePopup').addEventListener('click', () => {
        document.getElementById('welcomePopup').classList.add('hidden');
        localStorage.setItem('visited_lions', 'true');
    });

    document.getElementById('cartToggle').addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.toggle('hidden');
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('hidden');
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const cat = e.target.dataset.cat;
            const filtered = cat === 'all' ? products : products.filter(p => p.cat === cat);
            renderProducts(filtered);
        });
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        renderProducts(filtered);
    });
});

function renderProducts(items) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card fade-in">
            <img src="${p.img}" class="product-img" alt="${p.name}" onerror="this.src='https://placehold.co/400x300/1a1a1a/f59e0b?text=Lions+Electro'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-price">$${p.price.toFixed(2)}</p>
                <button class="btn-accent w-100" onclick="addToCart(${p.id})">Add To Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('lions_cart', JSON.stringify(cart));
    updateCartUI();
    alert(`${product.name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.innerText = cart.length;
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="flex-between" style="margin-bottom: 10px; border-bottom: 1px solid #334155; padding-bottom: 5px;">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">🗑️</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('lions_cart', JSON.stringify(cart));
    updateCartUI();
}

function scrollToProducts() {
    document.querySelector('.filters').scrollIntoView({ behavior: 'smooth' });
}