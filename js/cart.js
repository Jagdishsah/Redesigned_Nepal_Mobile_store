/* ==========================================================================
   Nepal Mobile Store — Cart Drawer & Checkout Engine (js/cart.js)
   ========================================================================== */

import { showToast } from './auth.js';

let cart = JSON.parse(localStorage.getItem('nepal_mobile_cart')) || [];

export function initCart() {
    updateCartUI();
    setupCartDrawerEvents();
}

export function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({
            id: product.id,
            model: product.model,
            brand: product.brand,
            price_npr: product.price_npr,
            image: product.image,
            qty: 1
        });
    }
    saveCart();
    updateCartUI();
    showToast(`Added ${product.model} to cart!`, 'success');
}

export function updateQty(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    }
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart', 'info');
}

function saveCart() {
    localStorage.setItem('nepal_mobile_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge-count');
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) badge.textContent = totalCount;

    const itemsContainer = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-subtotal-amount');

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h4>Your Cart is Empty</h4>
                <p style="font-size: 0.9rem;">Explore our latest mobile collection and add items!</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = 'NPR 0';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price_npr * item.qty), 0);
    if (subtotalEl) subtotalEl.textContent = `NPR ${subtotal.toLocaleString()}`;

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.model}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.model}</div>
                <div class="cart-item-price">NPR ${(item.price_npr * item.qty).toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="window.handleUpdateQty('${item.id}', -1)">-</button>
                    <span style="font-size: 0.9rem; font-weight: 700;">${item.qty}</span>
                    <button class="qty-btn" onclick="window.handleUpdateQty('${item.id}', 1)">+</button>
                    <button onclick="window.handleRemoveCartItem('${item.id}')" style="margin-left: auto; color: var(--danger); font-size: 0.85rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupCartDrawerEvents() {
    const cartToggle = document.getElementById('cart-toggle-btn');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-close-btn');

    if (cartToggle && overlay) {
        cartToggle.addEventListener('click', () => overlay.classList.add('active'));
    }
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    }
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }

    const checkoutBtn = document.getElementById('checkout-action-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'warning');
                return;
            }
            alert('🎉 Checkout Simulation: Order Placed Successfully!\n\nThank you for choosing Nepal Mobile Store. Our team will contact you for delivery confirmation in Nepal.');
            cart = [];
            saveCart();
            updateCartUI();
            if (overlay) overlay.classList.remove('active');
        });
    }
}

// Global Handlers
window.handleUpdateQty = (id, delta) => updateQty(id, delta);
window.handleRemoveCartItem = (id) => removeFromCart(id);
