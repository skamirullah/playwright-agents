import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export class OrdersPage extends ShopPage {
  readonly heading: Locator;
  readonly orderRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'My orders', exact: true });
    this.orderRows = page.getByRole('row');
  }

  orderRow(orderNumber: string): Locator {
    return this.orderRows.filter({ hasText: orderNumber });
  }

  orderDetailsToggle(orderNumber: string): Locator {
    return this.page.getByTestId(`toggle-order-${orderNumber}`);
  }

  orderItem(productName: string, color: string, quantity: number): Locator {
    return this.page.getByText(`${productName} (${color}) × ${quantity}`);
  }

  shipTo(recipient: string, city: string): Locator {
    return this.page.getByText(`Ship to ${recipient}, ${city}`);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
}
