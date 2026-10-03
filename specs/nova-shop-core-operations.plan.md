# Nova Shop Core User Operations Test Plan

## Application Overview

A focused functional plan for the Nova Shop e-commerce demo. Base URL: https://www.practiceqaautomation.com/shop. It covers five core shopper operations: authenticate, discover products, manage a cart, complete checkout, and review order history. Tests use environment-configured accounts and isolate browser storage so they begin from a fresh state. Orders and cart data are stored in browser localStorage.

## Test Scenarios

### 1. Nova Shop: Core Shopper Operations

**Fixture:** `fixtures/shop.fixture.ts`

#### 1.1. Sign in and manage the authenticated session

**File:** `tests/sign-in-session.spec.ts`

**Steps:**
  1. Start in a fresh browser context and open the base URL https://www.practiceqaautomation.com/shop.
    - expect: The app shows the Nova Shop sign-in form.
  2. Submit the form with both username and password blank.
    - expect: Sign-in is rejected and actionable validation or an error message is shown.
  3. Sign in with the configured locked-account username and password.
    - expect: Access is denied with a locked-account error; the user remains on the sign-in screen.
  4. Sign in with the configured standard-account username and password.
    - expect: Authentication succeeds and the Products page opens.
    - expect: The account name demo_user is shown, with Products, My orders, Cart, and Log out navigation available.
  5. Select Log out.
    - expect: The user is returned to the sign-in screen and authenticated navigation is no longer available.

#### 1.2. Find, filter, sort, and inspect a product

**File:** `tests/product-discovery.spec.ts`

**Steps:**
  1. Start with a fresh browser context, sign in as demo_user, and open the Products page at https://www.practiceqaautomation.com/shop/products.
    - expect: The catalog initially shows 12 of 12 products.
  2. Search for "headphones".
    - expect: The results narrow to Aurora Wireless Headphones and the displayed result count reflects the narrowed list.
  3. Clear the search, choose Electronics in Category, and enable In stock only.
    - expect: Only matching electronic products that are in stock are listed.
    - expect: Changing a filter updates the product results and displayed count.
  4. Choose Price (low to high), then Name (A to Z) in Sort by.
    - expect: Visible products reorder according to each selected sort mode.
  5. Search for a term that matches no product, then clear the search.
    - expect: The no-results state is shown without a broken product card; clearing the search restores catalog results.
  6. Open Aurora Wireless Headphones from the catalog.
    - expect: The product detail page shows its name, Electronics category, $129.99 price, 4.6 rating, stock status, and description/reviews/shipping tabs.
    - expect: Midnight, Lilac, and Snow color options and quantity controls are available.

#### 1.3. Add products, update cart, and apply a coupon

**File:** `tests/cart-coupon.spec.ts`

**Steps:**
  1. Start with a fresh browser context, sign in as demo_user, open Aurora Wireless Headphones, select Lilac, set quantity to 2, and choose Add to cart.
    - expect: A cart confirmation appears and the cart badge reports 2 items.
  2. Open the cart.
    - expect: Aurora Wireless Headphones appears with Lilac selected, quantity 2, and the correct line total.
  3. Increase quantity once and then decrease it once.
    - expect: The quantity and line total update after each action and return to the starting values.
    - expect: The decrement control cannot reduce quantity below the supported minimum.
  4. Enter an invalid coupon and apply it, then replace it with SAVE10 and apply it.
    - expect: The invalid coupon is rejected without changing the order total.
    - expect: SAVE10 is accepted and a 10% discount is shown in the order summary.
  5. Verify subtotal, discount, shipping, 8% tax, and total, then remove the coupon and remove the cart item.
    - expect: Each amount is recalculated consistently when the coupon is removed.
    - expect: Removing the item updates the cart badge and displays the empty-cart state with a route back to shopping.

#### 1.4. Validate checkout and place an order

**File:** `tests/checkout.spec.ts`

**Steps:**
  1. Start with a fresh browser context, sign in as demo_user, add one product to the cart, and open Checkout.
    - expect: Checkout shows contact/shipping, delivery, payment, terms, and an order summary matching the cart.
  2. Submit checkout with all fields blank.
    - expect: Checkout remains open and shows required-field errors for contact, address, delivery state, payment details, and terms; no order is created.
  3. Enter valid contact and shipping details: Taylor Jordan, taylor.jordan@example.com, 5551234567, 42 Demo Street, Austin, Texas, 78701. Select Express delivery.
    - expect: The entered values remain visible after each field is edited.
    - expect: Express delivery is selected and the $15.00 shipping charge is reflected in the summary.
  4. Select Credit / debit card; enter a cardholder name, a 16-digit number 4000 0000 0000 0002, a valid future MM/YY expiry, and a 3-digit CVV. Accept the terms and place the order.
    - expect: The simulated card decline is reported; checkout remains available and the cart contents are not lost.
  5. Change payment to Cash on delivery and submit the otherwise valid checkout again.
    - expect: The order completes and a thank-you confirmation with a generated order number appears.
    - expect: The confirmation reflects the item count, selected delivery, Cash on delivery, and total.
    - expect: The cart is cleared after successful placement.

#### 1.5. Review a saved order in order history

**File:** `tests/order-history.spec.ts`

**Steps:**
  1. Start with fresh browser storage and sign in as demo_user. Add a product and complete checkout with valid contact/shipping details, Standard delivery, Cash on delivery, and terms accepted.
    - expect: Checkout completes and provides a generated order number for this test's order.
  2. Open My orders.
    - expect: The order table contains the newly generated order number, current date, item count, Processing status, and total matching checkout.
  3. Expand Details for the new order.
    - expect: The expanded record shows the purchased product, selected variant when applicable, quantity, line amount, and ship-to name and city.
  4. Reload the order-history page and expand the same order again.
    - expect: The order remains visible after reload because this demo stores orders in the browser's localStorage.
