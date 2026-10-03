import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

test.describe('Nova Shop: Core Shopper Operations', () => {
  test('Review a saved order in order history', async ({ loginPage, productsPage, productDetailsPage, cartPage, checkoutPage, orderConfirmationPage, ordersPage }) => {
    const { standard } = SHOP_TEST_DATA.accounts;
    const { catalog, checkout } = SHOP_TEST_DATA;
    const recipient = checkout.orderHistoryShippingDetails;

    // 1. Sign in, add headphones, and complete a valid Standard / COD checkout.
    await loginPage.open();
    await loginPage.signIn(standard.username, standard.password);
    await productsPage.openProduct(catalog.productName);
    await productDetailsPage.addToCart();
    await productDetailsPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails(recipient);
    await checkoutPage.chooseStandardShipping();
    await checkoutPage.chooseCashOnDelivery();
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrder();

    await expect(orderConfirmationPage.heading).toBeVisible();
    await expect(orderConfirmationPage.orderNumber).toHaveText(/^NS-/);
    const orderNumber = await orderConfirmationPage.orderNumber.textContent();
    const orderTotal = await orderConfirmationPage.orderDefinitions.nth(3).textContent();
    expect(orderTotal).toMatch(/^\$\d+\.\d{2}$/);

    // 2. Verify the new order appears in My orders with the checkout total.
    await orderConfirmationPage.viewOrders();
    await expect(ordersPage.heading).toBeVisible();
    const orderRow = ordersPage.orderRow(orderNumber!);
    await expect(orderRow).toContainText(checkout.orderStatus);
    await expect(orderRow).toContainText(orderTotal!);
    await expect(orderRow).toContainText(checkout.expectedItemCount);

    // 3. Expand the order to verify the product and shipping recipient details.
    await ordersPage.orderDetailsToggle(orderNumber!).click();
    await expect(ordersPage.orderItem(catalog.productName, catalog.defaultColor, Number(checkout.expectedItemCount))).toBeVisible();
    await expect(ordersPage.shipTo(`${recipient.firstName} ${recipient.lastName}`, recipient.city)).toBeVisible();

    // 4. Reload order history and verify the saved order persists.
    await ordersPage.reload();
    await expect(ordersPage.orderRow(orderNumber!)).toContainText(orderTotal!);
  });
});
