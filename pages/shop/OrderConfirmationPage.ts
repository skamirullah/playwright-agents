import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export class OrderConfirmationPage extends ShopPage {
  readonly heading: Locator;
  readonly orderNumber: Locator;
  readonly orderDefinitions: Locator;
  readonly viewOrdersLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.orderNumber = page.getByText(/^NS-/);
    this.orderDefinitions = page.getByRole('definition');
    this.viewOrdersLink = page.getByTestId('view-orders');
  }

  async viewOrders(): Promise<void> {
    await this.viewOrdersLink.click();
  }
}
