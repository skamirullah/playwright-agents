import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export class CartPage extends ShopPage {
  readonly heading: Locator;
  readonly itemCountSummary: Locator;
  readonly emptyCartMessage: Locator;
  readonly lineTotal: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly removeItemButton: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponStatus: Locator;
  readonly removeCouponButton: Locator;
  readonly discount: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Your cart' });
    this.itemCountSummary = page.getByText(/^\d+ items?$/);
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.lineTotal = page.getByTestId('line-total');
    this.increaseQuantityButton = page.getByTestId('increase-qty');
    this.decreaseQuantityButton = page.getByTestId('decrease-qty');
    this.removeItemButton = page.getByTestId('remove-item');
    this.couponInput = page.getByTestId('coupon-input');
    this.applyCouponButton = page.getByTestId('apply-coupon');
    this.couponStatus = page.getByRole('status');
    this.removeCouponButton = page.getByRole('button', { name: 'remove', exact: true });
    this.discount = page.getByTestId('discount');
    this.checkoutLink = page.getByRole('link', { name: 'Checkout', exact: true });
  }

  selectedColor(color: string): Locator {
    return this.page.getByText(`Colour: ${color}`, { exact: true });
  }

  unitPrice(price: string): Locator {
    return this.page.getByText(`${price} each`, { exact: true });
  }

  appliedCouponMessage(code: string, discountText: string): Locator {
    return this.page.getByText(`${code} applied — ${discountText}`, { exact: true });
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseQuantityButton.click();
  }

  async decreaseQuantity(): Promise<void> {
    await this.decreaseQuantityButton.click();
  }

  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async removeCoupon(): Promise<void> {
    await this.removeCouponButton.click();
  }

  async removeItem(): Promise<void> {
    await this.removeItemButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }
}
