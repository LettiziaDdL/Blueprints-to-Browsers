/*
    Author: Lettizia Diaz de Leon
    Date: October 31, 2026
    Purpose: Runs the Confirmation page. Reads the order saved by js/checkout.js and
             shows the order number, date, items purchased, any discount, and the
             total so the customer can review what they just ordered.
*/

/* ==========================================
   LOAD THE LAST ORDER
========================================== */
const lastOrder = JSON.parse(localStorage.getItem("sktLastOrder"));

/* ==========================================
   SHOW THE ORDER DETAILS
   ------------------------------------------
   If there is no saved order (for example,
   after a consultation request), the general
   thank you message is shown by itself.
========================================== */
if (lastOrder) {
    document.getElementById("order-number").textContent = lastOrder.number;
    document.getElementById("order-meta").textContent =
        `Placed on ${lastOrder.date} by ${lastOrder.name}. ${lastOrder.itemCount} ${lastOrder.itemCount === 1 ? "item" : "items"} purchased.`;

    let itemsHTML = "";

    lastOrder.items.forEach(function(item) {
        itemsHTML += `<li><span>${item.name}${item.quantity > 1 ? " x" + item.quantity : ""}</span> <span>${formatMoney(item.price * item.quantity)}</span></li>`;
    });

    document.getElementById("order-items").innerHTML = itemsHTML;
    document.getElementById("order-subtotal").textContent = formatMoney(lastOrder.subtotal);

    if (lastOrder.discount > 0) {
        document.getElementById("order-discount-row").hidden = false;
        document.getElementById("order-discount-label").textContent = `Discount (${lastOrder.coupon})`;
        document.getElementById("order-discount").textContent = "-" + formatMoney(lastOrder.discount);
    }

    document.getElementById("order-total").textContent = formatMoney(lastOrder.total);
    document.getElementById("order-details").hidden = false;
}
