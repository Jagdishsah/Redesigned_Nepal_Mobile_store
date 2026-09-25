/* ==========================================================================
   Nepal Mobile Store — Core App Initializer (js/app.js)
   ========================================================================== */

import { initProducts } from './products.js';
import { initCart, addToCart } from './cart.js';
import { initAuthForms } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initProducts();
    initCart();
    initAuthForms();
});

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('nepal_mobile_theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nepal_mobile_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle-btn');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Global Add to Cart Handler bridging products.js to cart.js
window.handleAddToCart = async function(productId) {
    try {
        const response = await fetch('data/products.json');
        const products = await response.json();
        const product = products.find(p => p.id === productId);
        if (product) {
            addToCart(product);
        }
    } catch (err) {
        console.error('Error adding product to cart:', err);
    }
};
