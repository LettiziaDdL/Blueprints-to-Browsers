/*
    Author: Lettizia Diaz de Leon
    Date: November 4, 2026
    Purpose: Runs the Service Detail template. Reads the product id from the page
             address (service.html?id=lip-flip), finds that product in the data model,
             and fills in the name, price, description, details, steps, Add to Cart
             button, and related items. Shows Botox if the id is missing or unknown.
*/

/* ==========================================
   WHICH PRODUCT TO SHOW
========================================== */
const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");
const detailProduct = findProduct(requestedId) || findProduct("botox");

/* ==========================================
   DETAILS BY CATEGORY
   ------------------------------------------
   Each category has its own detail rows and
   "What to expect" steps. Treatments take a
   25% deposit of the starting price.
========================================== */
const categoryInfo = {
    "Consultation": {
        backLink: "services.html",
        backText: "Back to Services",
        rows: function(product) {
            return [
                ["Appointment length", "30 minutes"],
                ["Paid at checkout", formatMoney(product.price)],
                ["Consultation first?", "This is the consultation. Start here if you are new."]
            ];
        },
        steps: [
            "Add the consultation to your cart, or request a date on the Book a Consultation page.",
            "Pay at checkout to reserve your visit.",
            "We contact you to confirm your appointment.",
            "Meet privately with your provider to talk through your goals and options."
        ]
    },
    "Treatment": {
        backLink: "services.html",
        backText: "Back to Services",
        rows: function(product) {
            return [
                ["Appointment length", "30 to 60 minutes"],
                ["Deposit due at booking", formatMoney(product.price * 0.25)],
                ["Consultation first?", "Yes, a consultation is required before this treatment."]
            ];
        },
        steps: [
            "Book an initial consultation if you have not had one yet.",
            "Choose this treatment and pay the deposit to reserve your time.",
            "We contact you to confirm your appointment.",
            "Your treatment is done in person in a private room."
        ]
    },
    "Package": {
        backLink: "packages.html",
        backText: "Back to Packages and Gift Cards",
        rows: function(product) {
            return [
                ["Paid at checkout", formatMoney(product.price)],
                ["Scheduling", "Each session is booked separately after your consultation."],
                ["Consultation first?", "Yes, every package starts with a consultation."]
            ];
        },
        steps: [
            "Add the package to your cart and check out.",
            "Book your consultation so we can plan your sessions.",
            "We contact you to schedule each session in the package.",
            "Enjoy package pricing on every visit."
        ]
    },
    "Gift Card": {
        backLink: "packages.html",
        backText: "Back to Packages and Gift Cards",
        rows: function(product) {
            return [
                ["Gift card value", formatMoney(product.price)],
                ["Delivery", "A physical card mailed to the shipping address at checkout."],
                ["Expiration", "Never expires."]
            ];
        },
        steps: [
            "Add the gift card to your cart.",
            "Enter the shipping address of the person receiving it at checkout.",
            "We mail the gift card within 2 business days.",
            "The recipient can use it toward any consultation, treatment, or package."
        ]
    }
};

const info = categoryInfo[detailProduct.category];

/* ==========================================
   FILL IN THE PAGE
========================================== */
document.title = `${detailProduct.name} | SkInjection Tweakments`;

const backLink = document.getElementById("back-link");
backLink.href = info.backLink;
backLink.innerHTML = `&larr; ${info.backText}`;

document.getElementById("detail-img").setAttribute("aria-label", detailProduct.imageAlt);
document.getElementById("detail-category").textContent = detailProduct.category;
document.getElementById("page-heading").textContent = detailProduct.name;
document.getElementById("detail-price").textContent = detailProduct.startingAt
    ? "Starting at " + formatMoney(detailProduct.price)
    : formatMoney(detailProduct.price);
document.getElementById("detail-description").textContent = detailProduct.description;

// Item number comes from the product's place in the data model (SKT-001, SKT-002, ...)
const itemNumber = "SKT-" + String(products.indexOf(detailProduct) + 1).padStart(3, "0");

const rows = [["Item number", itemNumber], ["Category", detailProduct.category]].concat(info.rows(detailProduct));
let rowsHTML = "";
rows.forEach(function(row) {
    rowsHTML += `<dt>${row[0]}</dt><dd>${row[1]}</dd>`;
});
document.getElementById("detail-list").innerHTML = rowsHTML;

let stepsHTML = "";
info.steps.forEach(function(step) {
    stepsHTML += `<li>${step}</li>`;
});
document.getElementById("detail-steps").innerHTML = stepsHTML;

// Point the stock label and Add to Cart button at this product.
// js/cart.js then shows the live stock when it loads.
document.getElementById("detail-stock").dataset.stockFor = detailProduct.id;
document.getElementById("detail-add").dataset.id = detailProduct.id;
document.getElementById("detail-add-name").textContent = " " + detailProduct.name;

/* ==========================================
   RELATED ITEMS
   ------------------------------------------
   Up to 3 other products from the same
   category, shown with the regular cards.
========================================== */
const related = products.filter(function(product) {
    return product.category === detailProduct.category && product.id !== detailProduct.id;
}).slice(0, 3);

const relatedGrid = document.getElementById("related-grid");

if (related.length > 0) {
    relatedGrid.dataset.ids = related.map(function(product) { return product.id; }).join(",");
}
else {
    // Nothing else in this category, so hide the section
    relatedGrid.closest(".related").hidden = true;
    relatedGrid.removeAttribute("data-product-grid");
}
