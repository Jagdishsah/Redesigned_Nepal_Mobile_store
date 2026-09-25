# 🗺️ Codebase Map (`Redesigned/Files.md`)

This document provides a complete directory structure and component reference for the **Redesigned Nepal Mobile Store** project.

---

## 📁 Directory Tree

```text
Redesigned/
├── 📄 about.html              # About Us company profile & vision
├── 📄 contact.html            # Contact hub, social links, & support form
├── 📄 form.html               # Modern login portal with floating labels
├── 📄 index.html              # Storefront landing page, catalog & search
├── 📄 register.html           # User registration form with validation
├── 🐘 day.php                 # PHP backend script with PDO prepared statements & password_hash
├── 📋 Plan.md                # Architectural roadmap & GadgetByte pipeline design
├── 📋 Work_Step.md            # Task execution checklist
├── 🗺️ Files.md                # This codebase map
├── 📁 css/
│   ├── main.css               # Design system tokens, variables, & resets
│   ├── components.css         # Glassmorphism header, cards, modals, cart drawer
│   └── responsive.css         # Breakpoints & media queries
├── 📁 js/
│   ├── app.js                 # App bootstrapper, theme switcher, & event routing
│   ├── products.js            # Dynamic catalog renderer, live search, & filters
│   ├── cart.js                # Slide-over cart drawer & checkout simulation
│   └── auth.js                # Toast notifications & password strength validator
├── 📁 data/
│   └── products.json          # 70 live products ingested from GadgetByte Nepal
├── 📁 scripts/
│   └── fetch_gadgetbyte.py    # Python ingestion script for NPR prices & specs
└── 🖼️ Static Media Assets
    ├── 11.png, 22.png, 33.png, 44.png # Header icons
    ├── bg1.webp, bg12.jpg             # Banner images
    ├── icon.png                       # Browser tab favicon
    ├── ios.jpg, s25.jpg, p50.jpg, nokia.jpg # Product thumbnails
    └── visa.png, mc.png, paypal.png   # Payment badges
```

---

## 📑 File & Component Reference

### 1. Web Pages (HTML)
- [index.html](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/index.html): Storefront landing page featuring sticky glassmorphism header, live search bar, brand filter pills, dynamic products grid, quick-view modal, slide-over cart drawer, and footer.
- [form.html](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/form.html): Login portal with floating labels, password eye toggle, and toast notifications.
- [register.html](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/register.html): Registration form with matching password validator submitting to [day.php](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/day.php).
- [contact.html](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/contact.html): Support hub featuring phone (+977 9702406668), email, address, social badges (Facebook, Instagram, WhatsApp), and feedback form.
- [about.html](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/about.html): Company profile, mission, vision, and core benefits.

### 2. Stylesheets (CSS)
- [css/main.css](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/css/main.css): Design system CSS custom properties (colors, typography, shadows, elevation, dark/light theme tokens).
- [css/components.css](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/css/components.css): UI component styles for glassmorphism header, hero grid, catalog controls, product cards, modal dialogs, cart drawer, and toasts.
- [css/responsive.css](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/css/responsive.css): Responsive breakpoints for tablets, mobile screens, and desktops.

### 3. JavaScript Modules (ES6)
- [js/app.js](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/js/app.js): Core entry point initializing theme mode (`data-theme`), mobile navigation drawer, products, cart, and auth forms.
- [js/products.js](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/js/products.js): Asynchronously fetches [data/products.json](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/data/products.json), filters by brand/search, renders cards, and triggers Quick-View modal.
- [js/cart.js](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/js/cart.js): Cart state manager (`localStorage`), quantity update, cart drawer rendering, and checkout flow.
- [js/auth.js](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/js/auth.js): Toast notification system (`showToast()`) and form validation handlers.

### 4. Data & Scripts
- [scripts/fetch_gadgetbyte.py](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/scripts/fetch_gadgetbyte.py): Python data scraper executed via `/home/jagdish/Desktop/py/.venv/bin/python` to ingest live mobile tables and NPR prices from GadgetByte Nepal.
- [data/products.json](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/data/products.json): Structured JSON database containing 70 smartphone models with variants, prices in NPR, specs, and tags.
- [day.php](file:///home/jagdish/Desktop/Sandbox/Zara/Nepal/Redesigned/day.php): Server-side PHP script using MySQL prepared statements (`bind_param`) and `password_hash()`.
