/*
    Author: Lettizia Diaz de Leon
    Date: October 22, 2026
    Purpose: Validates the Contact page form. Email Address and Message are required,
             and Full Name and Email are checked for the correct format before a
             confirmation message is shown.
*/

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

clearErrorsOnInput(contactForm);

contactForm.addEventListener("submit", function(event) {
    // Stop the page from reloading so JavaScript can check the fields
    event.preventDefault();

    const nameField = document.getElementById("contact-name");
    const emailField = document.getElementById("contact-email");
    const subjectField = document.getElementById("contact-subject");
    const messageField = document.getElementById("contact-message");

    const errorCount = validateFields([
        {
            field: nameField,
            required: false,
            label: "Full name",
            test: isValidName,
            message: "Enter your name using letters only."
        },
        {
            field: emailField,
            required: true,
            label: "Email address",
            test: isValidEmail,
            message: "Enter an email address like name@example.com."
        },
        {
            field: subjectField,
            required: false,
            label: "Subject"
        },
        {
            field: messageField,
            required: true,
            label: "Message",
            test: function(value) { return value.trim().length >= 10; },
            message: "Your message should be at least 10 characters."
        }
    ]);

    if (errorCount > 0) {
        contactStatus.className = "form-status error-status";
        contactStatus.textContent = `Please fix the ${errorCount} highlighted ${errorCount === 1 ? "field" : "fields"}.`;
        return;
    }

    // All fields passed
    const firstName = nameField.value.trim().split(" ")[0];
    contactStatus.className = "form-status success-status";
    contactStatus.textContent = `Thank you${firstName ? ", " + firstName : ""}! Your message has been sent. We will reply within 1 to 2 business days.`;
    contactForm.reset();
});
