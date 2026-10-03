import { Locator, Page } from '@playwright/test';

export class ShopPage {
  protected readonly page: Page;
  readonly productsLink: Locator;
  readonly ordersLink: Locator;
  readonly cartLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsLink = page.getByRole('link', { name: 'Products', exact: true });
    this.ordersLink = page.getByRole('link', { name: 'My orders', exact: true });
    this.cartLink = page.getByTestId('cart-link');
    this.logoutButton = page.getByTestId('logout-button');
  }

  accountName(username: string): Locator {
    return this.page.getByText(username, { exact: true });
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openOrders(): Promise<void> {
    await this.ordersLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
