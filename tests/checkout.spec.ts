import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

test.describe('Nova Shop: Core Shopper Operations', () => {
  test('Validate checkout and place an order', async ({ page, loginPage, productsPage, productDetailsPage, cartPage, checkoutPage, orderConfirmationPage }) => {
    const { standard } = SHOP_TEST_DATA.accounts;
    const { catalog, cart, checkout } = SHOP_TEST_DATA;

    // 1. Sign in, add a product, and open checkout.
    await loginPage.open();
    await loginPage.signIn(standard.username, standard.password);
    await productsPage.openProduct(catalog.productName);
    await productDetailsPage.addToCart();
    await productDetailsPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(checkoutPage.heading).toBeVisible();
    await expect(checkoutPage.contactSectionHeading).toBeVisible();
    await expect(checkoutPage.deliverySectionHeading).toBeVisible();
    await expect(checkoutPage.paymentSectionHeading).toBeVisible();

    // 2. Submit an empty form and verify checkout validation.
    await checkoutPage.placeOrder();
    await expect(checkoutPage.validationSummary).toBeVisible();
    await expect(checkoutPage.firstNameError).toBeVisible();
    await expect(checkoutPage.emailError).toBeVisible();
    await expect(checkoutPage.termsError).toBeVisible();
    await expect(page).toHaveURL(/\/shop\/checkout$/);

    // 3. Enter valid contact and shipping details and choose Express delivery.
    await checkoutPage.fillShippingDetails(checkout.expressShippingDetails);
    await checkoutPage.chooseExpressShipping();
    await expect(checkoutPage.firstNameInput).toHaveValue(checkout.expressShippingDetails.firstName);
    await expect(checkoutPage.stateSelect).toHaveValue(checkout.expressShippingDetails.state);
    await expect(checkoutPage.summaryShipping).toHaveText(checkout.expressShippingCost);

    // 4. Try the known declined card and verify the cart remains available.
    const declinedCard = checkout.declinedCard;
    await checkoutPage.fillCardDetails(declinedCard.name, declinedCard.number, declinedCard.expiry, declinedCard.cvv);
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();
    await expect(checkoutPage.cardDeclinedMessage).toBeVisible();
    await expect(checkoutPage.heading).toBeVisible();
    await expect(checkoutPage.cartLink).toHaveAttribute('aria-label', cart.singleItemCartLabel);

    // 5. Switch to Cash on delivery and place the order successfully.
    await checkoutPage.chooseCashOnDelivery();
    await checkoutPage.placeOrder();
    await expect(orderConfirmationPage.heading).toBeVisible();
    await expect(orderConfirmationPage.orderNumber).toHaveText(/^NS-/);
    await expect(orderConfirmationPage.orderDefinitions.nth(0)).toHaveText(checkout.expectedItemCount);
    await expect(orderConfirmationPage.orderDefinitions.nth(1)).toHaveText(checkout.expressDeliveryLabel);
    await expect(orderConfirmationPage.orderDefinitions.nth(2)).toHaveText(checkout.paymentMethodLabel);
    await expect(orderConfirmationPage.cartLink).toHaveAttribute('aria-label', cart.emptyCartLabel);
  });
});
