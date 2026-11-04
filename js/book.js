/*
    Author: Lettizia Diaz de Leon
    Date: November 4, 2026
    Purpose: Validates the Book a Consultation form. Checks the name, email, and phone
             formats, makes sure the preferred date is open (Monday to Saturday, not in
             the past, and within 90 days) and the time is during business hours. A
             valid request is saved in localStorage, the Initial Consultation is added
             to the cart, and the customer is sent to checkout.
*/

const BOOKING_KEY = "sktBooking";
const MAX_DAYS_AHEAD = 90;
const OPEN_TIME = "09:00";
const CLOSE_TIME = "17:00";

const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");
const dateField = document.getElementById("visit-date");
const timeField = document.getElementById("visit-time");

/* ==========================================
   DATE HELPERS
========================================== */

// Formats a Date as YYYY-MM-DD in local time (the format date inputs use)
function toInputDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

// Turns "2026-11-12" into a local Date at midnight
function parseInputDate(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const lastDay = new Date(today);
lastDay.setDate(lastDay.getDate() + MAX_DAYS_AHEAD);

// Limit the date picker to today through 90 days from now
dateField.min = toInputDate(today);
dateField.max = toInputDate(lastDay);

/* ==========================================
   BOOKING CHECKS
========================================== */
function isOpenDate(value) {
    const date = parseInputDate(value);
    return date >= today && date <= lastDay && date.getDay() !== 0;
}

function isOpenTime(value) {
    return value >= OPEN_TIME && value <= CLOSE_TIME;
}

function dateMessage(value) {
    const date = parseInputDate(value);
    if (date < today) {
        return "Choose a date that has not already passed.";
    }
    if (date > lastDay) {
        return `Choose a date within the next ${MAX_DAYS_AHEAD} days.`;
    }
    return "We are closed on Sundays. Choose Monday through Saturday.";
}

// Turns "14:30" into "2:30 PM"
function formatTime(value) {
    const [hours, minutes] = value.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/* ==========================================
   SUBMIT
========================================== */
clearErrorsOnInput(bookingForm);

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nameField = document.getElementById("full-name");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const interestField = document.getElementById("interest");

    const errorCount = validateFields([
        { field: nameField, required: true, label: "Full name",
          test: isValidName, message: "Enter your name using letters only." },
        { field: emailField, required: true, label: "Email address",
          test: isValidEmail, message: "Enter an email address like name@example.com." },
        { field: phoneField, required: true, label: "Phone number",
          test: isValidPhone, message: "Enter a 10-digit phone number, like 210-555-0123." },
        { field: dateField, required: true, label: "Preferred date",
          test: isOpenDate, message: dateMessage(dateField.value || toInputDate(today)) },
        { field: timeField, required: true, label: "Preferred time",
          test: isOpenTime, message: "Choose a time between 9:00 AM and 5:00 PM." }
    ]);

    if (errorCount > 0) {
        bookingStatus.className = "form-status error-status";
        bookingStatus.textContent = `Please fix the ${errorCount} highlighted ${errorCount === 1 ? "field" : "fields"}.`;
        return;
    }

    // Add the consultation to the cart unless it is already there
    const alreadyInCart = getCart().some(function(item) {
        return item.id === "consult";
    });

    if (!alreadyInCart && !addToCart("consult")) {
        bookingStatus.className = "form-status error-status";
        bookingStatus.innerHTML = 'Sorry, there are no consultation openings left right now. Please <a href="contact.html">contact us</a> to join the waitlist.';
        return;
    }

    // Save the request so checkout and confirmation can show it.
    // Notes are not saved because they could contain private details.
    const visitDate = parseInputDate(dateField.value);
    const booking = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        phone: phoneField.value.trim(),
        interest: interestField.options[interestField.selectedIndex].text,
        date: visitDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
        time: formatTime(timeField.value)
    };

    localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));

    bookingStatus.className = "form-status success-status";
    bookingStatus.textContent = `Thank you, ${booking.name.split(" ")[0]}! Your consultation request was added to your cart. Taking you to checkout...`;

    setTimeout(function() {
        window.location.href = "checkout.html";
    }, 1200);
});
