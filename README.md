# SkInjection Tweakments Online Booking and Payment Site

## Purpose
SkInjection Tweakments is an injectable aesthetics concierge service that provides treatments such as Botox, dermal fillers, and threads to clients. This website lets clients learn about the services, book a consultation, and pay for appointments, treatment packages, and gift cards online.

The site follows an e-commerce structure with a service catalog, cart, and checkout. All treatments are performed in person after a consultation, so the website handles bookings, deposits, packages, and gift cards. The goal of this project is an accessible, easy-to-use site with a clear path from the homepage to checkout.

## Pages
| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Brand introduction, calls to action, and featured services built from the product data. |
| Services | `services.html` | All 16 consultations, treatments, packages, and gift cards, displayed with a JavaScript loop. |
| Service Detail | `service.html?id=...` | One template that shows any product's price, details, steps, live stock, Add to Cart, and related items. |
| Packages and Gift Cards | `packages.html` | Treatment packages and gift cards built from the product data. |
| Book a Consultation | `book.html` | Validated request form for a preferred date and time. Adds the Initial Consultation to the cart. |
| Cart | `cart.html` | Change quantities, remove items, clear the cart, and see a running subtotal. |
| Checkout | `checkout.html` | Shipping and payment forms with validation, coupon codes, order summary, and the preferred visit. |
| Confirmation | `confirmation.html` | Order number, items, discount, total, and the requested visit date and time. |
| About | `about.html` | The business story and what to expect. |
| Contact and FAQ | `contact.html` | Validated contact form and frequently asked questions. |
| Network Connection Test | `network.html` | Shows the local host name, communication port, transmission protocol, and last time launched. |

## Features
- **Product data model:** 16 products stored in one array of objects (`js/products.js`) with id, name, category, description, price, image text, and starting stock. Every product card and the Service Detail page are built from this data.
- **Service Detail template:** each product card links to `service.html?id=productId`. The page reads the id from the address and fills in the name, price, item number, category details, deposit (25% for treatments), what to expect, live stock, and up to 3 related items.
- **Shopping cart:** Add to Cart works on every page, and the cart is saved in localStorage so it stays between pages and visits. The menu shows a live cart count, and the Cart page supports quantity changes, removing items, and clearing the cart.
- **Inventory:** each product has a stock count that goes down when added to the cart and back up when removed. Sold-out items are greyed out, cannot be added, and show an Out of Stock tooltip.
- **Consultation booking:** the Book a Consultation form checks name, email, and phone formats, only allows Monday to Saturday dates within the next 90 days, and only allows times from 9:00 AM to 5:00 PM. A valid request adds the Initial Consultation to the cart, and the preferred visit appears on the checkout summary and the confirmation page.
- **Checkout:** shipping and payment fields are validated (including a Luhn check on the card number). Coupon codes TWEAK10 (10% off the order), GIFT15 (15% off gift cards), and FIRSTVISIT (50% off the Initial Consultation) are supported. Payment is a placeholder and no card details are saved or sent.
- **Contact form:** validated with friendly error messages.
- **Network Connection Test:** detects whether the site is running on a local server, a hosted server, or as a static file. It shows the host name, port, and protocol, and saves a `lastLaunch` cookie so the page can display the last time the site was launched.
- **Accessibility:** semantic HTML, skip link, labeled forms with error messages announced to screen readers, keyboard-friendly focus handling, and a color palette that meets WCAG AA contrast. Every page passes an axe-core WCAG 2 AA audit at desktop and phone widths.
- **Responsive layout:** mobile-first CSS with breakpoints at 768px and 1024px.

## How to Run Locally
1. Open the project folder in Visual Studio Code.
2. Install the **Live Preview** extension from Microsoft.
3. Open `index.html` and select **Show Preview**, or copy the preview address (for example `http://127.0.0.1:3000/index.html`) into a browser.
4. Visit **Network Test** in the footer to confirm the local connection is recognized.

Opening the HTML files directly also works, but the Network Connection Test will report that no server is running and will not save the launch cookie.

## Project Structure
```
Blueprints-to-Browsers/
├── index.html, services.html, service.html, packages.html, book.html,
│   cart.html, checkout.html, confirmation.html, about.html, contact.html,
│   network.html
├── css/
│   └── styles.css        Brand theme, responsive layout, and component styles
├── js/
│   ├── products.js       Product data model and the loop that builds product cards
│   ├── service.js        Fills in the Service Detail template from the ?id= value
│   ├── cart.js           Cart and stock saved in localStorage, cart count, Cart page
│   ├── validation.js     Shared validation and error message functions for all forms
│   ├── book.js           Book a Consultation validation and saved visit request
│   ├── contact.js        Contact form validation
│   ├── checkout.js       Order summary, coupons, checkout validation, saved order
│   ├── confirmation.js   Shows the finished order and requested visit
│   └── network.js        Network detection and the lastLaunch cookie
└── README.md
```

## Feature Roadmap

| Week | Milestone | Features | Status |
|------|-----------|----------|--------|
| Week 1 (Oct 12 to Oct 16, 2026) | Foundation and Homepage Structure | Semantic HTML pages, header, navigation, footer, and homepage layout. | Complete |
| Week 2 (Oct 19 to Oct 23, 2026) | Brand Styling and Responsive Layout | External stylesheet with brand colors and fonts, responsive layout. | Complete |
| Week 3 (Oct 26 to Oct 30, 2026) | Service Catalog | Services page and Service Detail template loading from the data model. | Complete |
| Week 4 (Nov 2 to Nov 6, 2026) | Shopping Cart | Add to cart, Cart page with quantity changes and subtotal, cart saved between pages. | Complete |
| Week 5 (Nov 9 to Nov 13, 2026) | Checkout and Booking | Checkout form and summary with preferred date and time, consultation request form, confirmation page. | Complete |
| Week 6 (Nov 16 to Nov 20, 2026) | Accessibility, Testing, and Launch Prep | Accessibility audit, local server testing, bug fixes, documentation, and publishing. | In progress (publishing to GitHub Pages remains) |

## Milestone Updates
- **2.6 Style and Substance:** Built the semantic HTML pages and external stylesheet.
- **3.6 Make It Click:** Services page loads 12 products from the data model with a JavaScript loop. Added a validated contact form, shipping and payment forms on the checkout page, and coupon code discounts (TWEAK10, GIFT15, FIRSTVISIT).
- **4.7 Smart Cart:** Added a working shopping cart saved in localStorage, live cart count, stock tracking with Out of Stock states, real cart totals at checkout, and order details on the Confirmation page. The product data grew to 16 items.
- **5.5 Grand Opening:** Added the Network Connection Test page (host name, port, protocol, and last time launched saved in a cookie) and linked it in every footer. Turned the Service Detail page into a template for all 16 products. Added validation to the Book a Consultation form and carried the preferred visit through checkout to the confirmation page. Ran an accessibility audit and fixed a heading order issue on Services and landmark labels on Checkout. Moved the stylesheet into a `css` folder and tested every page through a local server.

## Author
Lettizia Diaz de Leon
