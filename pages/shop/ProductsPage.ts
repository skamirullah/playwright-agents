import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export class ProductsPage extends ShopPage {
  readonly heading: Locator;
  readonly resultSummary: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly stockOnlyCheckbox: Locator;
  readonly sortSelect: Locator;
  readonly productNameLinks: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Products', exact: true });
    this.resultSummary = page.getByText(/^Showing \d+ of \d+ products$/);
    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
    this.stockOnlyCheckbox = page.getByTestId('in-stock-only');
    this.sortSelect = page.getByTestId('sort-select');
    this.productNameLinks = page.getByTestId('product-name');
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear filters' });
  }

  noProductsMessage(query: string): Locator {
    return this.page.getByText(`No products match “${query}”`);
  }

  productLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  async showInStockOnly(): Promise<void> {
    await this.stockOnlyCheckbox.check();
  }

  async sortBy(sortOption: string): Promise<void> {
    await this.sortSelect.selectOption(sortOption);
  }

  async openProduct(name: string): Promise<void> {
    await this.productLink(name).click();
  }
}
