/*
    Author: Lettizia Diaz de Leon
    Date: November 4, 2026
    Purpose: Product data model for SkInjection Tweakments. Stores every consultation,
             treatment, package, and gift card in one array of objects, including the
             starting stock for each item, and builds the product cards shown on the
             Home, Services, Packages, and Service Detail pages.
*/

/* ==========================================
   PRODUCT DATA
   ------------------------------------------
   Each product uses the fields from the
   data model: id, name, category,
   description, price, startingAt, imageAlt,
   and stock. For treatments, stock is the
   number of openings available to book.
   Prices and stock are sample values.
========================================== */
const products = [
    {
        id: "consult",
        name: "Initial Consultation",
        category: "Consultation",
        description: "A private one-on-one visit to discuss your goals and plan a treatment.",
        price: 50,
        startingAt: false,
        imageAlt: "Calm treatment room with soft lighting",
        stock: 10
    },
    {
        id: "botox",
        name: "Botox Treatment Session",
        category: "Treatment",
        description: "Softens fine lines on the forehead, frown lines, and crow's feet.",
        price: 300,
        startingAt: true,
        imageAlt: "Clean treatment tray ready for an appointment",
        stock: 6
    },
    {
        id: "lip-flip",
        name: "Lip Flip",
        category: "Treatment",
        description: "A small amount of Botox that gently turns the upper lip outward.",
        price: 150,
        startingAt: true,
        imageAlt: "Close-up of a relaxed, natural smile",
        stock: 4
    },
    {
        id: "brow-lift",
        name: "Botox Brow Lift",
        category: "Treatment",
        description: "Lifts and opens the eye area for a brighter, rested look.",
        price: 200,
        startingAt: true,
        imageAlt: "Soft-focus portrait showing the brow area",
        stock: 4
    },
    {
        id: "filler",
        name: "Dermal Filler Treatment",
        category: "Treatment",
        description: "Subtle volume and contour, planned together during your consultation.",
        price: 600,
        startingAt: true,
        imageAlt: "Soft towels and a treatment chair in a quiet room",
        stock: 3
    },
    {
        id: "lip-filler",
        name: "Lip Filler",
        category: "Treatment",
        description: "Adds natural-looking shape and hydration to the lips.",
        price: 550,
        startingAt: true,
        imageAlt: "Neutral lip balm and skincare items on a marble tray",
        stock: 3
    },
    {
        id: "under-eye",
        name: "Under-Eye Filler",
        category: "Treatment",
        description: "Smooths hollows under the eyes to reduce a tired appearance.",
        price: 650,
        startingAt: true,
        imageAlt: "Cooling eye pads resting on a clean towel",
        stock: 2
    },
    {
        id: "threads",
        name: "Thread Treatment",
        category: "Treatment",
        description: "A gentle lift with threads, planned after a consultation.",
        price: 800,
        startingAt: true,
        imageAlt: "Neatly arranged sterile supplies on a clean tray",
        stock: 1
    },
    {
        id: "consult-botox",
        name: "Consultation and Botox Package",
        category: "Package",
        description: "An initial consultation plus one Botox treatment session.",
        price: 330,
        startingAt: false,
        imageAlt: "Treatment room with a neatly folded towel",
        stock: 4
    },
    {
        id: "botox-refresh",
        name: "Botox Refresh Package",
        category: "Package",
        description: "Two Botox treatment sessions, booked after your consultation.",
        price: 560,
        startingAt: false,
        imageAlt: "Two folded towels on a treatment chair",
        stock: 3
    },
    {
        id: "maintenance",
        name: "Botox Maintenance Package",
        category: "Package",
        description: "Three Botox sessions scheduled across the year to keep results consistent.",
        price: 825,
        startingAt: false,
        imageAlt: "Calendar and appointment card on a desk",
        stock: 3
    },
    {
        id: "glow",
        name: "Full Glow Package",
        category: "Package",
        description: "One Botox session and one filler session, booked together at a package price.",
        price: 850,
        startingAt: false,
        imageAlt: "Gift box with ribbon next to skincare products",
        stock: 3
    },
    {
        id: "filler-thread",
        name: "Filler and Thread Package",
        category: "Package",
        description: "One dermal filler treatment and one thread treatment.",
        price: 1300,
        startingAt: false,
        imageAlt: "Soft lighting over a treatment chair",
        stock: 2
    },
    {
        id: "gift-50",
        name: "$50 Gift Card",
        category: "Gift Card",
        description: "A physical gift card mailed to you or someone special. Never expires.",
        price: 50,
        startingAt: false,
        imageAlt: "Plum gift card in a cream envelope",
        stock: 25
    },
    {
        id: "gift-100",
        name: "$100 Gift Card",
        category: "Gift Card",
        description: "A physical gift card mailed to you or someone special. Never expires.",
        price: 100,
        startingAt: false,
        imageAlt: "Plum gift card tied with a gold ribbon",
        stock: 20
    },
    {
        id: "gift-200",
        name: "$200 Gift Card",
        category: "Gift Card",
        description: "A physical gift card mailed to you or someone special. Never expires.",
        price: 200,
        startingAt: false,
        imageAlt: "Plum gift card in a gift box with a gold ribbon",
        stock: 10
    }
];

/* ==========================================
   HELPER: FORMAT A NUMBER AS DOLLARS
========================================== */
function formatMoney(amount) {
    return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ==========================================
   HELPER: FIND A PRODUCT BY ITS ID
========================================== */
function findProduct(id) {
    return products.find(function(product) {
        return product.id === id;
    });
}

/* ==========================================
   BUILD ONE PRODUCT CARD
   ------------------------------------------
   Uses the live stock from js/cart.js so
   the count matches what is in the cart.
========================================== */
function createProductCard(product) {
    const available = getAvailableStock(product.id);
    const soldOut = available === 0;

    const priceLabel = product.startingAt
        ? "Starting at " + formatMoney(product.price)
        : formatMoney(product.price);

    // Every card links to the Service Detail template for that product
    const detailLink = `service.html?id=${product.id}`;

    return `
        <article class="card${soldOut ? " out-of-stock" : ""}" data-product-id="${product.id}">
            <div class="placeholder card-img" role="img" aria-label="${product.imageAlt}"><span>[ Image placeholder ]</span></div>
            <p class="category-tag">${product.category}</p>
            <h3><a href="${detailLink}">${product.name}</a></h3>
            <p>${product.description}</p>
            <p class="price">${priceLabel}</p>
            <p class="stock">${soldOut ? "Out of Stock" : available + " available"}</p>
            <button type="button" class="button button-small add-to-cart" data-id="${product.id}" ${soldOut ? "disabled" : ""}>
                ${soldOut ? "Out of Stock" : "Add to Cart"}<span class="visually-hidden"> ${product.name}</span>
            </button>
        </article>
    `;
}

/* ==========================================
   DISPLAY PRODUCTS WITH A LOOP
   ------------------------------------------
   Any element with data-product-grid gets
   product cards. It can show:
   - every product (data-product-grid="all")
   - one category (data-category="Package")
   - chosen items (data-ids="consult,botox")
========================================== */
function renderProductGrids() {
    const grids = document.querySelectorAll("[data-product-grid]");

    grids.forEach(function(grid) {
        let list = products;

        if (grid.dataset.category) {
            list = products.filter(function(product) {
                return product.category === grid.dataset.category;
            });
        }
        else if (grid.dataset.ids) {
            list = grid.dataset.ids.split(",").map(findProduct).filter(Boolean);
        }

        let cardsHTML = "";

        for (const product of list) {
            cardsHTML += createProductCard(product);
        }

        grid.innerHTML = cardsHTML;
    });

    // Show how many products were loaded on the Services page
    const productCount = document.getElementById("product-count");
    if (productCount) {
        productCount.textContent = `Showing ${products.length} services, packages, and gift cards.`;
    }

    // Update stock text and buttons on the Service Detail page
    document.querySelectorAll("[data-stock-for]").forEach(function(wrapper) {
        const id = wrapper.dataset.stockFor;
        const available = getAvailableStock(id);
        const soldOut = available === 0;
        const button = wrapper.querySelector(".add-to-cart");
        const stockText = wrapper.querySelector(".stock");

        wrapper.classList.toggle("out-of-stock", soldOut);

        if (stockText) {
            stockText.textContent = soldOut ? "Out of Stock" : available + " available";
        }

        if (button) {
            button.disabled = soldOut;
            button.firstChild.textContent = soldOut ? "Out of Stock" : "Add to Cart";
        }
    });
}
