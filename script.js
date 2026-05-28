// Data
const dummyProducts = [
    { id: 1, name: "Premium Men's Blue Kurta", price: 499, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500", stock: 12 },
    { id: 2, name: "Stylish Women's Gown", price: 699, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", stock: 5 }
];

let products = JSON.parse(localStorage.getItem('ls_products')) || dummyProducts;
let cart = [];
let orders = JSON.parse(localStorage.getItem('ls_orders')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('ls_current_user')) || null;
let isSignupMode = false;

const ADMIN_EMAIL = "admin@littlestor.com";
const ADMIN_PASS = "@admin123";

window.onload = function() {
    loadProducts();
    updateNavbarUI();
};

function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" class="product-image">
            <div class="product-info">
                <span class="price">₹${p.price}</span>
                <h3 class="product-name">${p.name}</h3>
                <p style="font-size:12px; color:${p.stock > 0 ? '#10b981' : '#ef4444'}">Stock: ${p.stock}</p>
                <button class="auth-primary-btn" style="margin-top:10px" onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function handleAuth() {
    const email = document.getElementById('auth-email').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    const name = document.getElementById('auth-name').value.trim();

    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        currentUser = { name: "Akash Shukla (Admin)", email: email, role: "admin" };
    } else if (email && pass) {
        currentUser = { name: isSignupMode ? name : email.split('@')[0], email: email, role: "user" };
    } else {
        return alert("Kripya details sahi bharein!");
    }

    sessionStorage.setItem('ls_current_user', JSON.stringify(currentUser));
    location.reload();
}

function updateNavbarUI() {
    const loginLink = document.getElementById('login-link');
    if (currentUser) {
        loginLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        loginLink.onclick = () => { sessionStorage.removeItem('ls_current_user'); location.reload(); };
        if (currentUser.role === 'admin') document.getElementById('admin-link').style.display = "block";
        else document.getElementById('user-orders-link').style.display = "block";
    }
}

function updatePreview() {
    const name = document.getElementById('p-name').value || "Product Name";
    const price = document.getElementById('p-price').value || "0";
    const img = document.getElementById('p-img').value || "https://via.placeholder.com/200";
    const preview = document.getElementById('live-preview-card');
    preview.innerHTML = `
        <img src="${img}" class="product-image">
        <div class="product-info">
            <span class="price">₹${price}</span>
            <h3 class="product-name">${name}</h3>
        </div>
    `;
}

function addNewProduct() {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const stock = document.getElementById('p-stock').value;
    const img = document.getElementById('p-img').value;
    if (name && price && img) {
        products.push({ id: Date.now(), name, price: parseInt(price), stock: parseInt(stock), image: img });
        localStorage.setItem('ls_products', JSON.stringify(products));
        alert("Product Added!"); location.reload();
    }
}

function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(`admin-${tab}`).style.display = 'block';
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function toggleCart() { document.getElementById('cart-panel').classList.toggle('open'); }
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    cart.push(p);
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('cart-items').innerHTML = cart.map(i => `<p>${i.name} - ₹${i.price}</p>`).join('');
}
// Placeholder for orders and modals logic
function openAddressModal() { document.getElementById('address-modal').style.display = 'flex'; }
function closeAddressModal() { document.getElementById('address-modal').style.display = 'none'; }