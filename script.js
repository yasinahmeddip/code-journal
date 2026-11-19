const app = {
    products: [],
    cart: JSON.parse(localStorage.getItem('lions_cart')) || [],
    
    async init() {
        const res = await fetch('data.json');
        const data = await res.json();
        this.products = data.products;
        this.renderProducts(this.products);
        this.updateCartUI();
        this.checkWelcomePopup();
    },

    renderProducts(items) {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = items.map(p => `
            <div class="card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p class="price">$${p.price}</p>
                <button class="btn-add" onclick="app.addToCart(${p.id})">Add to Cart</button>
            </div>
        `).join('');
    },

    filter(category) {
        document.querySelectorAll('#categoryList li').forEach(li => li.classList.remove('active'));
        event.target.classList.add('active');
        const filtered = category === 'all' ? this.products : this.products.filter(p => p.category === category);
        this.renderProducts(filtered);
    },

    search() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = this.products.filter(p => p.name.toLowerCase().includes(query));
        this.renderProducts(filtered);
    },

    addToCart(id) {
        const product = this.products.find(p => p.id === id);
        this.cart.push(product);
        this.saveCart();
        this.updateCartUI();
    },

    saveCart() {
        localStorage.setItem('lions_cart', JSON.stringify(this.cart));
    },

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        cartCount.innerText = this.cart.length;
        cartItems.innerHTML = this.cart.map((item, idx) => `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">
                <span>${item.name}</span>
                <span>$${item.price} <i class="fa fa-trash" onclick="app.removeFromCart(${idx})" style="cursor:pointer; color:#e74c3c; margin-left:10px;"></i></span>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerText = total.toFixed(2);
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartUI();
    },

    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
    },

    checkWelcomePopup() {
        if (!localStorage.getItem('lions_welcomed')) {
            setTimeout(() => {
                document.getElementById('welcomePopup').style.display = 'flex';
            }, 2000);
        }
    },

    closePopup() {
        document.getElementById('welcomePopup').style.display = 'none';
        localStorage.setItem('lions_welcomed', 'true');
    },

    scrollToShop() {
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    },

    checkout() {
        alert('Please login to complete your order!');
    }
};

window.onload = () => app.init();