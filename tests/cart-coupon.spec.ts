import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

// spec: specs/nova-shop-core-operations.plan.md

test.describe('Nova Shop: Core Shopper Operations', () => {
  test('Add products, update cart, and apply a coupon', async ({ loginPage, productsPage, productDetailsPage, cartPage }) => {
    const { standard } = SHOP_TEST_DATA.accounts;
    const { catalog, cart } = SHOP_TEST_DATA;

    // 1. Sign in, select a variant, set quantity, and add the product.
    await loginPage.open();
    await loginPage.signIn(standard.username, standard.password);
    await productsPage.openProduct(catalog.productName);
    await productDetailsPage.selectColor(cart.color);
    for (let quantity = 1; quantity < cart.initialQuantity; quantity += 1) {
      await productDetailsPage.increaseQuantity();
    }
    await productDetailsPage.addToCart();
    await expect(productDetailsPage.addToCartConfirmation).toBeVisible();
    await expect(productDetailsPage.cartLink).toHaveAttribute('aria-label', cart.initialCartLabel);

    // 2. Verify the product, variant, quantity, and line amount in the cart.
    await productDetailsPage.openCart();
    await expect(cartPage.heading).toBeVisible();
    await expect(cartPage.selectedColor(cart.color)).toBeVisible();
    await expect(cartPage.unitPrice(catalog.productPrice)).toBeVisible();
    await expect(cartPage.lineTotal).toHaveText(cart.initialLineTotal);

    // 3. Update quantity and ensure the cart responds to the change.
    await cartPage.increaseQuantity();
    await expect(cartPage.itemCountSummary).toHaveText(cart.increasedItemCount);
    await expect(cartPage.lineTotal).toHaveText(cart.increasedLineTotal);
    await cartPage.decreaseQuantity();
    await expect(cartPage.itemCountSummary).toHaveText(cart.initialItemCount);
    await expect(cartPage.lineTotal).toHaveText(cart.initialLineTotal);

    // 4. Reject an invalid coupon, then apply the valid coupon.
    await cartPage.applyCoupon(cart.coupon.invalid);
    await expect(cartPage.couponStatus).toContainText(cart.coupon.invalid);
    await expect(cartPage.couponStatus).toContainText(cart.coupon.invalidMessage);
    await cartPage.applyCoupon(cart.coupon.valid);
    const appliedCouponMessage = cartPage.appliedCouponMessage(cart.coupon.valid, cart.coupon.discountMessage);
    await expect(appliedCouponMessage).toBeVisible();
    await expect(cartPage.discount).toHaveText(cart.coupon.discountAmount);

    // 5. Remove the coupon and item, and verify the empty-cart state.
    await cartPage.removeCoupon();
    await expect(appliedCouponMessage).toHaveCount(0);
    await cartPage.removeItem();
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.cartLink).toHaveAttribute('aria-label', cart.emptyCartLabel);
  });
});
