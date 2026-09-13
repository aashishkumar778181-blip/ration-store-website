// Product Database
const products = [
    { id: 1, name: 'Basmati Rice', category: 'grains', price: 350, emoji: '🍚', unit: 'kg' },
    { id: 2, name: 'Wheat Flour', category: 'grains', price: 45, emoji: '🌾', unit: 'kg' },
    { id: 3, name: 'Red Lentils', category: 'pulses', price: 120, emoji: '🔴', unit: 'kg' },
    { id: 4, name: 'Chickpeas', category: 'pulses', price: 100, emoji: '⭕', unit: 'kg' },
    { id: 5, name: 'Turmeric Powder', category: 'spices', price: 80, emoji: '🟡', unit: '500g' },
    { id: 6, name: 'Chili Powder', category: 'spices', price: 90, emoji: '🌶️', unit: '500g' },
    { id: 7, name: 'Mustard Oil', category: 'oils', price: 250, emoji: '🫗', unit: 'litre' },
    { id: 8, name: 'Coconut Oil', category: 'oils', price: 300, emoji: '🥥', unit: 'litre' },
    { id: 9, name: 'Sugar', category: 'grains', price: 55, emoji: '🍬', unit: 'kg' },
    { id: 10, name: 'Salt', category: 'spices', price: 25, emoji: '🧂', unit: 'kg' },
    { id: 11, name: 'Black Peppercorns', category: 'spices', price: 200, emoji: '⚫', unit: '100g' },
    { id: 12, name: 'Moong Dal', category: 'pulses', price: 110, emoji: '💛', unit: 'kg' },
];

// Shopping Cart
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts('all');
    loadCartFromLocalStorage();
    updateCartCount();
});

// Display Products
function displayProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
                <div class="product-quantity">
                    <label>Qty:</label>
                    <input type="number" id="qty-${product.id}" min="1" max="100" value="1">
                    <span>${product.unit}</span>
                </div>
                <button class="btn btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Products
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayProducts(category);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);

    if (quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            unit: product.unit
        });
    }

    saveCartToLocalStorage();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Open Cart
document.querySelector('.cart-link').addEventListener('click', function() {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
});

// Display Cart Items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.getElementById('cartTotal').textContent = '0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div>Qty: ${item.quantity} ${item.unit} @ ₹${item.price.toFixed(2)} each</div>
            </div>
            <div>
                <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
                <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

// Close Cart Modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully!\nTotal: ₹${total.toFixed(2)}\n\nThank you for your purchase!`);
    
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
    closeCart();
}

// Local Storage Functions
function saveCartToLocalStorage() {
    localStorage.setItem('rationStoreCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('rationStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        closeCart();
    }
});
