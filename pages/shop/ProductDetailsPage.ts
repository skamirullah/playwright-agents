import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export class ProductDetailsPage extends ShopPage {
  readonly heading: Locator;
  readonly price: Locator;
  readonly stockStatus: Locator;
  readonly rating: Locator;
  readonly descriptionTab: Locator;
  readonly reviewsTab: Locator;
  readonly shippingTab: Locator;
  readonly quantityInput: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;
  readonly addToCartConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.price = page.getByText(/^\$\d+\.\d{2}$/).first();
    this.stockStatus = page.getByText('In stock', { exact: true });
    this.rating = page.getByText(/^\d\.\d$/).first();
    this.descriptionTab = page.getByRole('tab', { name: 'description' });
    this.reviewsTab = page.getByRole('tab', { name: 'reviews' });
    this.shippingTab = page.getByRole('tab', { name: 'shipping' });
    this.quantityInput = page.getByRole('textbox', { name: 'Quantity' });
    this.decreaseQuantityButton = page.getByTestId('qty-decrease');
    this.increaseQuantityButton = page.getByTestId('qty-increase');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addToCartConfirmation = page.getByText('Added to your cart.');
  }

  colorOption(color: string): Locator {
    return this.page.getByRole('radio', { name: color });
  }

  async selectColor(color: string): Promise<void> {
    const colorTestId = `color-${color.toLowerCase()}`;
    await this.page.locator('label').filter({ has: this.page.getByTestId(colorTestId) }).click();
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseQuantityButton.click();
  }

  async decreaseQuantity(): Promise<void> {
    await this.decreaseQuantityButton.click();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
