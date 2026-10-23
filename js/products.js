/*
    Author: Lettizia Diaz de Leon
    Date: October 22, 2026
    Purpose: Product data model for SkInjection Tweakments. Stores every consultation,
             treatment, package, and gift card in one array of objects and uses a loop
             to display them as product cards on the Services page.
*/

/* ==========================================
   PRODUCT DATA
   ------------------------------------------
   Each product uses the fields from the
   data model: id, name, category,
   description, price, startingAt, imageAlt.
   Prices are sample values for now.
========================================== */
const products = [
    {
        id: "consult",
        name: "Initial Consultation",
        category: "Consultation",
        description: "A private one-on-one visit to discuss your goals and plan a treatment.",
        price: 50,
        startingAt: false,
        imageAlt: "Calm treatment room with soft lighting"
    },
    {
        id: "botox",
        name: "Botox Treatment Session",
        category: "Treatment",
        description: "Softens fine lines on the forehead, frown lines, and crow's feet.",
        price: 300,
        startingAt: true,
        imageAlt: "Clean treatment tray ready for an appointment"
    },
    {
        id: "lip-flip",
        name: "Lip Flip",
        category: "Treatment",
        description: "A small amount of Botox that gently turns the upper lip outward.",
        price: 150,
        startingAt: true,
        imageAlt: "Close-up of a relaxed, natural smile"
    },
    {
        id: "brow-lift",
        name: "Botox Brow Lift",
        category: "Treatment",
        description: "Lifts and opens the eye area for a brighter, rested look.",
        price: 200,
        startingAt: true,
        imageAlt: "Soft-focus portrait showing the brow area"
    },
    {
        id: "filler",
        name: "Dermal Filler Treatment",
        category: "Treatment",
        description: "Subtle volume and contour, planned together during your consultation.",
        price: 600,
        startingAt: true,
        imageAlt: "Soft towels and a treatment chair in a quiet room"
    },
    {
        id: "lip-filler",
        name: "Lip Filler",
        category: "Treatment",
        description: "Adds natural-looking shape and hydration to the lips.",
        price: 550,
        startingAt: true,
        imageAlt: "Neutral lip balm and skincare items on a marble tray"
    },
    {
        id: "under-eye",
        name: "Under-Eye Filler",
        category: "Treatment",
        description: "Smooths hollows under the eyes to reduce a tired appearance.",
        price: 650,
        startingAt: true,
        imageAlt: "Cooling eye pads resting on a clean towel"
    },
    {
        id: "threads",
        name: "Thread Treatment",
        category: "Treatment",
        description: "A gentle lift with threads, planned after a consultation.",
        price: 800,
        startingAt: true,
        imageAlt: "Neatly arranged sterile supplies on a clean tray"
    },
    {
        id: "maintenance",
        name: "Botox Maintenance Package",
        category: "Package",
        description: "Three Botox sessions scheduled across the year to keep results consistent.",
        price: 825,
        startingAt: false,
        imageAlt: "Calendar and appointment card on a desk"
    },
    {
        id: "glow",
        name: "Full Glow Package",
        category: "Package",
        description: "One Botox session and one filler session, booked together at a package price.",
        price: 850,
        startingAt: false,
        imageAlt: "Gift box with ribbon next to skincare products"
    },
    {
        id: "gift-50",
        name: "$50 Gift Card",
        category: "Gift Card",
        description: "A physical gift card mailed to you or someone special. Never expires.",
        price: 50,
        startingAt: false,
        imageAlt: "Plum gift card in a cream envelope"
    },
    {
        id: "gift-100",
        name: "$100 Gift Card",
        category: "Gift Card",
        description: "A physical gift card mailed to you or someone special. Never expires.",
        price: 100,
        startingAt: false,
        imageAlt: "Plum gift card tied with a gold ribbon"
    }
];

/* ==========================================
   HELPER: FORMAT A NUMBER AS DOLLARS
========================================== */
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
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
   DISPLAY PRODUCTS WITH A LOOP
   ------------------------------------------
   Only runs on pages that have a
   #product-grid container (Services page).
========================================== */
const productGrid = document.getElementById("product-grid");

if (productGrid) {
    let cardsHTML = "";

    for (const product of products) {
        const priceLabel = product.startingAt
            ? "Starting at " + formatMoney(product.price)
            : formatMoney(product.price);

        cardsHTML += `
            <article class="card">
                <div class="placeholder card-img" role="img" aria-label="${product.imageAlt}"><span>[ Image placeholder ]</span></div>
                <p class="category-tag">${product.category}</p>
                <h3><a href="service.html">${product.name}</a></h3>
                <p>${product.description}</p>
                <p class="price">${priceLabel}</p>
                <button type="button" class="button button-small">Add to Cart<span class="visually-hidden"> ${product.name}</span></button>
            </article>
        `;
    }

    productGrid.innerHTML = cardsHTML;

    // Show how many products were loaded
    const productCount = document.getElementById("product-count");
    if (productCount) {
        productCount.textContent = `Showing ${products.length} services, packages, and gift cards.`;
    }
}
