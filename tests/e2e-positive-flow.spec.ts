import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

test.describe('Nova Shop: End-to-end positive flow', () => {
  test('Shopper purchases a product and verifies the saved order', async ({
    loginPage,
    productsPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    orderConfirmationPage,
    ordersPage,
  }) => {
    const { standard } = SHOP_TEST_DATA.accounts;
    const { catalog, cart, checkout } = SHOP_TEST_DATA;
    const recipient = checkout.orderHistoryShippingDetails;

    await loginPage.open();
    await loginPage.signIn(standard.username, standard.password);
    await expect(productsPage.heading).toBeVisible();

    await productsPage.search(catalog.searchTerm);
    await expect(productsPage.productLink(catalog.productName)).toBeVisible();
    await productsPage.openProduct(catalog.productName);

    await expect(productDetailsPage.heading).toHaveText(catalog.productName);
    await productDetailsPage.selectColor(cart.color);
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.addToCartConfirmation).toBeVisible();
    await productDetailsPage.openCart();

    await expect(cartPage.heading).toBeVisible();
    await expect(cartPage.selectedColor(cart.color)).toBeVisible();
    await cartPage.applyCoupon(cart.coupon.valid);
    const couponConfirmation = cartPage.appliedCouponMessage(cart.coupon.valid, cart.coupon.discountMessage);
    await expect(couponConfirmation).toBeVisible();

    await cartPage.proceedToCheckout();
    await expect(checkoutPage.heading).toBeVisible();
    await checkoutPage.fillShippingDetails(recipient);
    await checkoutPage.chooseStandardShipping();
    await checkoutPage.chooseCashOnDelivery();
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();

    await expect(orderConfirmationPage.heading).toBeVisible();
    await expect(orderConfirmationPage.orderNumber).toHaveText(/^NS-/);
    await expect(orderConfirmationPage.orderDefinitions.nth(0)).toHaveText(checkout.expectedItemCount);
    await expect(orderConfirmationPage.orderDefinitions.nth(1)).toHaveText('standard');
    await expect(orderConfirmationPage.orderDefinitions.nth(2)).toHaveText(checkout.paymentMethodLabel);
    const orderNumber = await orderConfirmationPage.orderNumber.textContent();
    const orderTotal = await orderConfirmationPage.orderDefinitions.nth(3).textContent();
    expect(orderTotal).toMatch(/^\$\d+\.\d{2}$/);

    await orderConfirmationPage.viewOrders();
    await expect(ordersPage.heading).toBeVisible();
    const orderRow = ordersPage.orderRow(orderNumber!);
    await expect(orderRow).toContainText(checkout.orderStatus);
    await expect(orderRow).toContainText(orderTotal!);
    await ordersPage.orderDetailsToggle(orderNumber!).click();
    await expect(ordersPage.orderItem(catalog.productName, cart.color, Number(checkout.expectedItemCount))).toBeVisible();
    await expect(ordersPage.shipTo(`${recipient.firstName} ${recipient.lastName}`, recipient.city)).toBeVisible();
  });
});
