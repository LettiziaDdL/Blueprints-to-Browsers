/*
    Author: Lettizia Diaz de Leon
    Date: October 22, 2026
    Purpose: Shared input validation functions for the SkInjection Tweakments forms.
             Each function checks one kind of field and returns true or false, and the
             showError and clearError helpers display accessible error messages.
*/

/* ==========================================
   REQUIRED FIELD CHECK
========================================== */
function isFilled(value) {
    return value.trim() !== "";
}

/* ==========================================
   FIELD-SPECIFIC CHECKS
========================================== */

// Letters, spaces, apostrophes, periods, and hyphens, at least 2 characters
function isValidName(value) {
    return /^[A-Za-z][A-Za-z .'-]{1,}$/.test(value.trim());
}

// Something@something.something with no spaces
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

// Exactly 10 digits once spaces, dashes, dots, and parentheses are removed
function isValidPhone(value) {
    const digits = value.replace(/[\s().-]/g, "");
    return /^\d{10}$/.test(digits);
}

// 5-digit ZIP or ZIP+4 (12345 or 12345-6789)
function isValidZip(value) {
    return /^\d{5}(-\d{4})?$/.test(value.trim());
}

// 13 to 19 digits that also pass the Luhn checksum used by card companies
function isValidCardNumber(value) {
    const digits = value.replace(/[\s-]/g, "");

    if (!/^\d{13,19}$/.test(digits)) {
        return false;
    }

    let sum = 0;
    let doubleIt = false;

    // Walk the digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = Number(digits[i]);

        if (doubleIt) {
            digit = digit * 2;
            if (digit > 9) {
                digit = digit - 9;
            }
        }

        sum += digit;
        doubleIt = !doubleIt;
    }

    return sum % 10 === 0;
}

// MM/YY format, a real month, and not already expired
function isValidExpiration(value) {
    const match = value.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

    if (!match) {
        return false;
    }

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
}

// 3 or 4 digits
function isValidSecurityCode(value) {
    return /^\d{3,4}$/.test(value.trim());
}

/* ==========================================
   ERROR MESSAGE HELPERS
   ------------------------------------------
   Each field has a matching <p class="error">
   with the id "fieldId-error".
========================================== */
function showError(field, message) {
    const errorBox = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", "true");
    if (errorBox) {
        errorBox.textContent = message;
    }
}

function clearError(field) {
    const errorBox = document.getElementById(field.id + "-error");
    field.removeAttribute("aria-invalid");
    if (errorBox) {
        errorBox.textContent = "";
    }
}

/* ==========================================
   RUN A LIST OF CHECKS
   ------------------------------------------
   Each rule is { field, required, test,
   label, message }. Returns the number of
   fields with errors and moves focus to the
   first problem so keyboard users find it.
========================================== */
function validateFields(rules) {
    let errorCount = 0;
    let firstInvalid = null;

    for (const rule of rules) {
        const value = rule.field.value;

        if (rule.required && !isFilled(value)) {
            showError(rule.field, `${rule.label} is required.`);
        }
        else if (isFilled(value) && rule.test && !rule.test(value)) {
            showError(rule.field, rule.message);
        }
        else {
            clearError(rule.field);
            continue;
        }

        errorCount++;
        if (!firstInvalid) {
            firstInvalid = rule.field;
        }
    }

    if (firstInvalid) {
        firstInvalid.focus();
    }

    return errorCount;
}

/* ==========================================
   CLEAR AN ERROR AS SOON AS THE USER TYPES
========================================== */
function clearErrorsOnInput(form) {
    form.addEventListener("input", function(event) {
        if (event.target.getAttribute("aria-invalid") === "true") {
            clearError(event.target);
        }
    });
}
