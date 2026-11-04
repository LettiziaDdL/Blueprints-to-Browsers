/*
    Author: Lettizia Diaz de Leon
    Date: November 4, 2026
    Purpose: Runs the Checkout page. Builds the order summary from the shopping cart
             saved in localStorage, applies percentage discounts from valid coupon
             codes, validates the shipping and payment fields, and saves the finished
             order so the confirmation page can show it before the cart is emptied.
             If a consultation was requested on the Book page, the preferred visit
             is shown in the summary, saved with the order, and the name and phone
             fields are filled in from the request.
*/

/* ==========================================
   CART ITEMS
   ------------------------------------------
   Loaded from the cart saved by js/cart.js.
========================================== */
const cartItems = getCart();
const ORDER_KEY = "sktLastOrder";
const BOOKING_KEY = "sktBooking";

// Consultation request from the Book page, if there is one
const booking = JSON.parse(localStorage.getItem(BOOKING_KEY));

/* ==========================================
   COUPON CODES
   ------------------------------------------
   appliesTo can be "order" for the whole
   order, or a product category or product id
   for a targeted discount.
========================================== */
const coupons = {
    TWEAK10: {
        percent: 10,
        appliesTo: "order",
        description: "10% off your entire order"
    },
    GIFT15: {
        percent: 15,
        appliesTo: "Gift Card",
        description: "15% off gift cards"
    },
    FIRSTVISIT: {
        percent: 50,
        appliesTo: "consult",
        description: "50% off your Initial Consultation"
    }
};

let activeCoupon = null;

/* ==========================================
   DOM REFERENCES
========================================== */
const summaryList = document.getElementById("summary-list");
const subtotalOutput = document.getElementById("summary-subtotal");
const discountRow = document.getElementById("discount-row");
const discountLabel = document.getElementById("discount-label");
const discountOutput = document.getElementById("summary-discount");
const totalOutput = document.getElementById("summary-total");

const couponField = document.getElementById("coupon");
const couponButton = document.getElementById("apply-coupon");
const couponMessage = document.getElementById("coupon-message");

const checkoutForm = document.getElementById("checkout-form");
const checkoutStatus = document.getElementById("checkout-status");

/* ==========================================
   DISCOUNT FUNCTION
   ------------------------------------------
   Returns the dollar amount saved on one
   line item for the active coupon.
========================================== */
function getDiscount(product, lineTotal, coupon) {
    if (!coupon) {
        return 0;
    }

    const matches = coupon.appliesTo === "order"
        || coupon.appliesTo === product.category
        || coupon.appliesTo === product.id;

    if (matches) {
        return lineTotal * (coupon.percent / 100);
    }

    return 0;
}

/* ==========================================
   BUILD THE ORDER SUMMARY
========================================== */
function renderSummary() {
    let subtotal = 0;
    let discount = 0;
    let listHTML = "";

    if (cartItems.length === 0) {
        summaryList.innerHTML = '<li>Your cart is empty. <a href="services.html">Browse services</a></li>';
    }

    cartItems.forEach(function(item) {
        const product = findProduct(item.id);
        if (!product) return;
        const lineTotal = product.price * item.quantity;

        subtotal += lineTotal;
        discount += getDiscount(product, lineTotal, activeCoupon);

        listHTML += `<li><span>${product.name}${item.quantity > 1 ? " x" + item.quantity : ""}</span> <span>${formatMoney(lineTotal)}</span></li>`;
    });

    if (cartItems.length > 0) {
        summaryList.innerHTML = listHTML;
    }
    subtotalOutput.textContent = formatMoney(subtotal);

    if (discount > 0) {
        discountRow.hidden = false;
        discountLabel.textContent = `Discount (${activeCoupon.code})`;
        discountOutput.textContent = "-" + formatMoney(discount);
    }
    else {
        discountRow.hidden = true;
    }

    totalOutput.textContent = formatMoney(subtotal - discount);

    return { subtotal: subtotal, discount: discount, total: subtotal - discount };
}

/* ==========================================
   APPLY A COUPON CODE
========================================== */
function applyCoupon() {
    const code = couponField.value.trim().toUpperCase();

    if (!isFilled(code)) {
        activeCoupon = null;
        couponMessage.className = "help error";
        couponMessage.textContent = "Enter a coupon code first.";
        renderSummary();
        return;
    }

    // Check whether the coupon code exists
    if (!(code in coupons)) {
        activeCoupon = null;
        couponField.setAttribute("aria-invalid", "true");
        couponMessage.className = "help error";
        couponMessage.textContent = `"${code}" is not a valid coupon code.`;
        renderSummary();
        return;
    }

    activeCoupon = { code: code, ...coupons[code] };
    couponField.removeAttribute("aria-invalid");
    couponMessage.className = "help success";
    couponMessage.textContent = `Coupon applied: ${activeCoupon.description}.`;
    renderSummary();
}

couponButton.addEventListener("click", applyCoupon);

// Let Enter in the coupon box apply the code instead of submitting the order
couponField.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        applyCoupon();
    }
});

/* ==========================================
   CHECKOUT FORM VALIDATION
========================================== */
clearErrorsOnInput(checkoutForm);

checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // An order needs at least one item
    if (cartItems.length === 0) {
        checkoutStatus.className = "form-status error-status";
        checkoutStatus.innerHTML = 'Your cart is empty. <a href="services.html">Add a service</a> before placing an order.';
        return;
    }

    const errorCount = validateFields([
        // Shipping information
        { field: document.getElementById("ship-name"), required: true, label: "Full name",
          test: isValidName, message: "Enter your name using letters only." },
        { field: document.getElementById("ship-street"), required: true, label: "Street address",
          test: function(value) { return /\d/.test(value) && value.trim().length >= 5; },
          message: "Enter a street address that includes a house or building number." },
        { field: document.getElementById("ship-city"), required: true, label: "City",
          test: isValidName, message: "Enter a city name using letters only." },
        { field: document.getElementById("ship-state"), required: true, label: "State" },
        { field: document.getElementById("ship-zip"), required: true, label: "ZIP code",
          test: isValidZip, message: "Enter a 5-digit ZIP code, like 78205." },
        { field: document.getElementById("ship-phone"), required: true, label: "Phone number",
          test: isValidPhone, message: "Enter a 10-digit phone number, like 210-555-0123." },

        // Payment information
        { field: document.getElementById("card-name"), required: true, label: "Cardholder name",
          test: isValidName, message: "Enter the name exactly as it appears on the card." },
        { field: document.getElementById("card-number"), required: true, label: "Credit card number",
          test: isValidCardNumber, message: "Enter a valid 13 to 19 digit card number." },
        { field: document.getElementById("card-expiration"), required: true, label: "Expiration date",
          test: isValidExpiration, message: "Enter a future date in MM/YY format, like 08/28." },
        { field: document.getElementById("card-cvv"), required: true, label: "Security code",
          test: isValidSecurityCode, message: "Enter the 3 or 4 digit code on your card." }
    ]);

    if (errorCount > 0) {
        checkoutStatus.className = "form-status error-status";
        checkoutStatus.textContent = `Please fix the ${errorCount} highlighted ${errorCount === 1 ? "field" : "fields"} before placing your order.`;
        return;
    }

    // Everything is valid. Save the order details for the confirmation page.
    // No card details are saved or sent anywhere.
    const totals = renderSummary();

    const order = {
        number: "SKT-" + String(Date.now()).slice(-6),
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        name: document.getElementById("ship-name").value.trim(),
        items: cartItems.map(function(item) {
            const product = findProduct(item.id);
            return { name: product.name, price: product.price, quantity: item.quantity };
        }),
        itemCount: cartItems.reduce(function(sum, item) { return sum + item.quantity; }, 0),
        subtotal: totals.subtotal,
        discount: totals.discount,
        coupon: activeCoupon ? activeCoupon.code : "",
        total: totals.total,
        visit: booking ? `${booking.interest} on ${booking.date} at ${booking.time}` : ""
    };

    localStorage.setItem(ORDER_KEY, JSON.stringify(order));

    // The visit request is now part of the order
    localStorage.removeItem(BOOKING_KEY);

    // The items were purchased, so empty the cart (stock stays lowered)
    completeOrder();

    checkoutStatus.className = "form-status success-status";
    checkoutStatus.textContent = "Order placed! Taking you to your confirmation...";
    window.location.href = "confirmation.html";
});

/* ==========================================
   PREFERRED VISIT FROM THE BOOK PAGE
========================================== */
if (booking) {
    document.getElementById("visit-details").textContent =
        `${booking.interest} on ${booking.date} at ${booking.time}. We will call ${booking.phone} to confirm.`;
    document.getElementById("visit-box").hidden = false;

    // Save the customer some typing
    const shipName = document.getElementById("ship-name");
    const shipPhone = document.getElementById("ship-phone");
    if (!shipName.value) shipName.value = booking.name;
    if (!shipPhone.value) shipPhone.value = booking.phone;
}

/* ==========================================
   SHOW THE SUMMARY WHEN THE PAGE LOADS
========================================== */
renderSummary();
