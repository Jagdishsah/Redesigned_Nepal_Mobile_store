/* ==========================================================================
   Nepal Mobile Store — Dynamic Product Engine (js/products.js)
   ========================================================================== */

let allProducts = [];
let activeBrand = 'All';
let searchQuery = '';

export async function initProducts() {
    const gridContainer = document.getElementById('products-grid');
    if (!gridContainer) return;

    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        allProducts = await response.json();
        renderProducts();
        setupFilterListeners();
    } catch (err) {
        console.error('Products load error:', err);
        gridContainer.innerHTML = `<div class="error-msg" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--danger);">Failed to load mobile catalog. Please refresh.</div>`;
    }
}

export function renderProducts() {
    const gridContainer = document.getElementById('products-grid');
    if (!gridContainer) return;

    const filtered = allProducts.filter(p => {
        const matchesBrand = (activeBrand === 'All') || (p.brand.toLowerCase() === activeBrand.toLowerCase());
        const matchesSearch = p.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (p.variant && p.variant.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesBrand && matchesSearch;
    });

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 1rem; display: block;"></i>
                <h3>No Mobile Models Found</h3>
                <p>Try searching for a different brand or model name.</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.tag ? `<span class="badge-tag">${product.tag}</span>` : ''}
            <div class="product-img-wrapper" onclick="openQuickView('${product.id}')" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.model}" loading="lazy">
            </div>
            <div class="product-details">
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-title" onclick="openQuickView('${product.id}')" style="cursor: pointer;">${product.model}</h3>
                
                <div class="product-specs-list">
                    <span class="spec-chip"><i class="fas fa-microchip"></i> ${product.specs?.ram || '8GB RAM'}</span>
                    <span class="spec-chip"><i class="fas fa-hdd"></i> ${product.specs?.storage || '128GB'}</span>
                </div>

                <div class="product-footer">
                    <div class="product-price">${product.formatted_price}</div>
                    <button class="add-cart-btn" onclick="window.handleAddToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilterListeners() {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderProducts();
        });
    }

    const pills = document.querySelectorAll('.brand-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeBrand = pill.dataset.brand || 'All';
            renderProducts();
        });
    });
}

// Global Quick View Modal Handler
window.openQuickView = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = product.model;
    document.getElementById('modal-brand').textContent = product.brand;
    document.getElementById('modal-price').textContent = product.formatted_price;
    document.getElementById('modal-display').textContent = product.specs?.display || 'N/A';
    document.getElementById('modal-processor').textContent = product.specs?.processor || 'N/A';
    document.getElementById('modal-ram').textContent = product.specs?.ram || 'N/A';
    document.getElementById('modal-storage').textContent = product.specs?.storage || 'N/A';
    document.getElementById('modal-camera').textContent = product.specs?.camera || 'N/A';
    document.getElementById('modal-battery').textContent = product.specs?.battery || 'N/A';
    
    document.getElementById('modal-add-btn').onclick = () => {
        window.handleAddToCart(product.id);
        modal.classList.remove('active');
    };

    modal.classList.add('active');
};
