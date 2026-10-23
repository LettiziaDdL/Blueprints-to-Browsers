# SkInjection Tweakments Online Booking and Payment Site

## Purpose
SkInjection Tweakments is an injectable aesthetics concierge service that provides treatments such as Botox, dermal fillers, and threads to clients. This website will let clients learn about the services, book a consultation, and pay for appointments, treatment packages, and gift cards online.

The site follows an e-commerce structure with a service catalog, cart, and checkout. All treatments are performed in person after a consultation, so the website handles bookings, deposits, packages, and gift cards. The goal of this project is to plan and build an accessible, easy-to-use site with a clear path from the homepage to checkout.

## Planned Pages
Home, Services, Service Detail, Packages and Gift Cards, Book a Consultation, Cart, Checkout, Booking Confirmation, About, and Contact and FAQ.

## Feature Roadmap

| Week | Milestone | Features | Tasks (estimated time) | Target Date |
|------|-----------|----------|------------------------|-------------|
| Week 1 (Oct 12 to Oct 16, 2026) | Foundation and Homepage Structure | Page structure with semantic HTML, header, navigation, footer, and the homepage layout. | Set up repository and file structure (1 hr); Build header, navigation, and footer (3 hrs); Build homepage hero and featured sections (4 hrs) | Oct 16, 2026 |
| Week 2 (Oct 19 to Oct 23, 2026) | Brand Styling and Responsive Layout | External stylesheet with the brand colors, fonts, and a layout that works on phones and desktops. | Write base styles using the color palette (3 hrs); Style homepage sections (4 hrs); Add responsive breakpoints and test (3 hrs) | Oct 23, 2026 |
| Week 3 (Oct 26 to Oct 30, 2026) | Service Catalog | Services page and service detail pages that load from the data model. | Create service data file with sample items (3 hrs); Build services page grid (4 hrs); Build service detail page template (4 hrs) | Oct 30, 2026 |
| Week 4 (Nov 2 to Nov 6, 2026) | Shopping Cart | Add to cart for consultations, services, packages, and gift cards, plus a cart page with quantity changes and a running subtotal. | Write cart logic in JavaScript (5 hrs); Build cart page (3 hrs); Keep the cart saved between pages (2 hrs) | Nov 6, 2026 |
| Week 5 (Nov 9 to Nov 13, 2026) | Checkout and Booking | Checkout form with order summary and preferred date and time, a consultation request form, and a confirmation page. Payment will use a placeholder until a third-party processor is added. | Build checkout form and order summary (4 hrs); Add form validation (3 hrs); Build consultation request form (3 hrs); Build confirmation page (2 hrs) | Nov 13, 2026 |
| Week 6 (Nov 16 to Nov 20, 2026) | Accessibility, Testing, and Launch Prep | Accessibility checks, cross-browser testing, bug fixes, and publishing the site. | Accessibility audit (contrast, keyboard, alt text) (3 hrs); Cross-browser and mobile testing (3 hrs); Fix bugs and polish (3 hrs); Publish site and update documentation (1 hr) | Nov 20, 2026 |

## Project Structure
- HTML pages are in the main folder.
- `styles.css` holds the brand theme and responsive layout.
- `js/products.js` holds the product data model and the loop that displays product cards.
- `js/validation.js` holds shared input validation functions used by every form.
- `js/contact.js` validates the Contact page form.
- `js/checkout.js` builds the order summary, applies coupon codes, and validates checkout.

## Milestone Updates
- **2.6 Style and Substance:** Built the semantic HTML pages and external stylesheet.
- **3.6 Make It Click:** Services page now loads 12 products from the data model with a JavaScript loop. Added a validated contact form, shipping and payment forms on the checkout page, and a coupon code discount (TWEAK10, GIFT15, FIRSTVISIT).

## Author
Lettizia Diaz de Leon
