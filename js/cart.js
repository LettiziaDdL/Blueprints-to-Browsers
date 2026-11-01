/*
    Author: Lettizia Diaz de Leon
    Date: October 31, 2026
    Purpose: Shopping cart and inventory system for SkInjection Tweakments. Saves the
             cart and the available stock in localStorage so they stay through page
             refreshes and between pages, updates the cart count in the navigation,
             shows feedback when an item is added, displays an Out of Stock tooltip,
             and builds the Cart page with quantity controls, remove, and clear.
*/

/* ==========================================
   STORAGE KEYS
========================================== */
const CART_KEY = "sktCart";
const STOCK_KEY = "sktStock";

/* ==========================================
   LOAD AND SAVE THE CART
   ------------------------------------------
   The cart is an array of { id, quantity }.
========================================== */
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ==========================================
   LOAD AND SAVE THE STOCK
   ------------------------------------------
   Stock is saved as { productId: count }.
   Any product not saved yet starts with the
   stock value from the product data.
========================================== */
function getStockData() {
    const saved = JSON.parse(localStorage.getItem(STOCK_KEY)) || {};

    products.forEach(function(product) {
        if (!(product.id in saved)) {
            saved[product.id] = product.stock;
        }
    });

    return saved;
}

function saveStockData(stock) {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
}

function getAvailableStock(id) {
    return getStockData()[id] || 0;
}

/* ==========================================
   CART TOTALS
========================================== */
function getCartTotals() {
    let count = 0;
    let subtotal = 0;

    getCart().forEach(function(item) {
        const product = findProduct(item.id);
        if (!product) return;

        count += item.quantity;
        subtotal += product.price * item.quantity;
    });

    return { count: count, subtotal: subtotal };
}

/* ==========================================
   ADD TO CART
   ------------------------------------------
   Lowers the available stock by one and
   adds one to the item's quantity.
========================================== */
function addToCart(id) {
    const stock = getStockData();

    // Stop if the item is out of stock
    if (!stock[id] || stock[id] <= 0) {
        return false;
    }

    const cart = getCart();
    const item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    if (item) {
        item.quantity++;
    }
    else {
        cart.push({ id: id, quantity: 1 });
    }

    stock[id]--;

    saveCart(cart);
    saveStockData(stock);
    refreshPage();
    return true;
}

/* ==========================================
   CHANGE AN ITEM'S QUANTITY
   ------------------------------------------
   Moves units between the cart and stock.
   A quantity of 0 removes the item.
========================================== */
function setQuantity(id, newQuantity) {
    const cart = getCart();
    const stock = getStockData();
    const item = cart.find(function(cartItem) {
        return cartItem.id === id;
    });

    if (!item) return;

    // The most a customer can have is what is in the cart plus what is left in stock
    const maxQuantity = item.quantity + stock[id];
    newQuantity = Math.max(0, Math.min(Math.floor(newQuantity) || 0, maxQuantity));

    // Return or take stock based on the change
    stock[id] += item.quantity - newQuantity;
    item.quantity = newQuantity;

    saveCart(cart.filter(function(cartItem) {
        return cartItem.quantity > 0;
    }));
    saveStockData(stock);
    refreshPage();
}

/* ==========================================
   REMOVE AN ITEM
   ------------------------------------------
   Returns every unit of the item to stock.
========================================== */
function removeFromCart(id) {
    setQuantity(id, 0);
}

/* ==========================================
   CLEAR THE CART
   ------------------------------------------
   Returns every item in the cart to stock.
========================================== */
function clearCart() {
    const stock = getStockData();

    getCart().forEach(function(item) {
        stock[item.id] += item.quantity;
    });

    saveCart([]);
    saveStockData(stock);
    refreshPage();
}

/* ==========================================
   COMPLETE AN ORDER
   ------------------------------------------
   Used by checkout. The items were bought,
   so stock stays lowered and the cart empties.
========================================== */
function completeOrder() {
    saveCart([]);
}

/* ==========================================
   CART COUNT IN THE NAVIGATION
========================================== */
function updateCartCount() {
    const { count } = getCartTotals();

    document.querySelectorAll('.nav-list a[href="cart.html"]').forEach(function(link) {
        link.innerHTML = `Cart (<span class="cart-count">${count}</span>)<span class="visually-hidden"> items</span>`;
    });
}

/* ==========================================
   VISUAL FEEDBACK WHEN AN ITEM IS ADDED
   ------------------------------------------
   Three things happen at once:
   1. The button turns green and says "Added".
   2. The cart count in the navigation pulses.
   3. A notification slides in at the bottom
      of the screen with a link to the cart.
========================================== */
let toastTimer;

function showAddedFeedback(product) {
    // 1. Button change (the card was rebuilt, so find the new button)
    const button = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
    if (button && !button.disabled) {
        button.classList.add("added");
        button.firstChild.textContent = "Added ✓";
        setTimeout(function() {
            button.classList.remove("added");
            button.firstChild.textContent = "Add to Cart";
        }, 1200);
    }

    // 2. Pulse the cart count
    document.querySelectorAll(".cart-count").forEach(function(badge) {
        badge.classList.add("pulse");
    });

    // 3. Notification message
    let toast = document.getElementById("cart-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cart-toast";
        toast.className = "cart-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<strong>${product.name}</strong> was added to your cart. <a href="cart.html">View cart</a>`;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);
}

/* ==========================================
   OUT OF STOCK CURSOR TOOLTIP
   ------------------------------------------
   Follows the mouse over any sold-out card.
========================================== */
const stockTooltip = document.createElement("div");
stockTooltip.className = "stock-tooltip";
stockTooltip.textContent = "Out of Stock";
stockTooltip.setAttribute("aria-hidden", "true");
document.body.appendChild(stockTooltip);

document.addEventListener("mousemove", function(event) {
    const soldOutArea = event.target.closest(".out-of-stock");

    if (soldOutArea) {
        stockTooltip.style.left = event.clientX + 14 + "px";
        stockTooltip.style.top = event.clientY + 14 + "px";
        stockTooltip.classList.add("show");
    }
    else {
        stockTooltip.classList.remove("show");
    }
});

document.addEventListener("mouseleave", function() {
    stockTooltip.classList.remove("show");
});

/* ==========================================
   ADD TO CART BUTTONS
   ------------------------------------------
   One listener handles every Add to Cart
   button on the page, including cards that
   are rebuilt after the stock changes.
========================================== */
document.addEventListener("click", function(event) {
    const button = event.target.closest(".add-to-cart");
    if (!button || button.disabled) return;

    const product = findProduct(button.dataset.id);
    if (product && addToCart(product.id)) {
        showAddedFeedback(product);
        keepFocus(`.add-to-cart[data-id="${product.id}"]`, `[data-product-id="${product.id}"] h3 a`);
    }
});

/* ==========================================
   KEEP KEYBOARD FOCUS AFTER A REDRAW
   ------------------------------------------
   Cards and cart rows are rebuilt after each
   change, so focus moves to the new button
   (or a fallback) instead of being lost.
========================================== */
function keepFocus(selector, fallbackSelector) {
    const target = document.querySelector(selector);

    if (target && !target.disabled) {
        target.focus();
    }
    else if (fallbackSelector && document.querySelector(fallbackSelector)) {
        document.querySelector(fallbackSelector).focus();
    }
}

/* ==========================================
   CART PAGE
   ------------------------------------------
   Only runs on pages with #cart-body.
========================================== */
const cartBody = document.getElementById("cart-body");

function renderCartPage() {
    if (!cartBody) return;

    const cart = getCart();
    const stock = getStockData();
    const { count, subtotal } = getCartTotals();

    const cartTable = document.getElementById("cart-table-wrap");
    const emptyMessage = document.getElementById("cart-empty");
    const checkoutLink = document.getElementById("checkout-link");
    const clearButton = document.getElementById("clear-cart");

    // Empty cart
    if (cart.length === 0) {
        cartTable.hidden = true;
        emptyMessage.hidden = false;
        clearButton.disabled = true;
        checkoutLink.hidden = true;
        return;
    }

    cartTable.hidden = false;
    emptyMessage.hidden = true;
    clearButton.disabled = false;
    checkoutLink.hidden = false;

    let rowsHTML = "";

    cart.forEach(function(item) {
        const product = findProduct(item.id);
        if (!product) return;

        const lineTotal = product.price * item.quantity;
        const maxQuantity = item.quantity + stock[item.id];

        rowsHTML += `
            <tr>
                <th scope="row">${product.name}</th>
                <td data-label="Price">${formatMoney(product.price)}</td>
                <td data-label="Quantity">
                    <div class="qty-control">
                        <button type="button" class="qty-button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity of ${product.name}">&minus;</button>
                        <label class="visually-hidden" for="qty-${item.id}">Quantity for ${product.name}</label>
                        <input type="number" id="qty-${item.id}" class="qty-input" data-id="${item.id}" value="${item.quantity}" min="1" max="${maxQuantity}">
                        <button type="button" class="qty-button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity of ${product.name}" ${stock[item.id] === 0 ? "disabled" : ""}>+</button>
                    </div>
                </td>
                <td data-label="Total">${formatMoney(lineTotal)}</td>
                <td class="remove-cell">
                    <button type="button" class="link-button" data-action="remove" data-id="${item.id}">Remove<span class="visually-hidden"> ${product.name}</span></button>
                </td>
            </tr>
        `;
    });

    cartBody.innerHTML = rowsHTML;
    document.getElementById("cart-item-count").textContent = count + (count === 1 ? " item" : " items");
    document.getElementById("cart-subtotal").textContent = formatMoney(subtotal);
}

if (cartBody) {
    // Plus, minus, and remove buttons
    cartBody.addEventListener("click", function(event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const item = getCart().find(function(cartItem) {
            return cartItem.id === id;
        });
        if (!item) return;

        const action = button.dataset.action;

        if (action === "increase") {
            setQuantity(id, item.quantity + 1);
        }
        else if (action === "decrease") {
            setQuantity(id, item.quantity - 1);
        }
        else if (action === "remove") {
            removeFromCart(id);
        }

        keepFocus(`button[data-action="${action}"][data-id="${id}"]`, "#clear-cart:not(:disabled), #cart-empty a");
    });

    // Typing a new quantity
    cartBody.addEventListener("change", function(event) {
        if (event.target.classList.contains("qty-input")) {
            setQuantity(event.target.dataset.id, Number(event.target.value));
        }
    });

    // Clear cart button
    document.getElementById("clear-cart").addEventListener("click", function() {
        if (confirm("Remove every item from your cart?")) {
            clearCart();
        }
    });
}

/* ==========================================
   REFRESH EVERYTHING THAT SHOWS CART DATA
========================================== */
function refreshPage() {
    updateCartCount();
    renderProductGrids();
    renderCartPage();
}

refreshPage();
