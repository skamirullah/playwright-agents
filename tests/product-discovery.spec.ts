import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

test.describe('Nova Shop: Core Shopper Operations', () => {
  test('Find, filter, sort, and inspect a product', async ({ loginPage, productsPage, productDetailsPage }) => {
    const { standard } = SHOP_TEST_DATA.accounts;
    const { catalog } = SHOP_TEST_DATA;

    // 1. Sign in and verify the initial catalog count.
    await loginPage.open();
    await loginPage.signIn(standard.username, standard.password);
    await expect(productsPage.resultSummary).toHaveText(catalog.expectedInitialCount);

    // 2. Search for headphones.
    await productsPage.search(catalog.searchTerm);
    await expect(productsPage.resultSummary).toHaveText(catalog.expectedSearchCount);
    await expect(productsPage.productLink(catalog.productName)).toBeVisible();

    // 3. Filter by category and availability.
    await productsPage.search('');
    await productsPage.filterByCategory(catalog.category);
    await productsPage.showInStockOnly();
    await expect(productsPage.productNameLinks.first()).toBeVisible();
    const filteredNames = await productsPage.productNameLinks.allTextContents();

    // 4. Exercise both supported sort orders.
    await productsPage.sortBy(catalog.sortByPriceAscending);
    await expect(productsPage.sortSelect).toHaveValue(catalog.sortByPriceAscending);
    await productsPage.sortBy(catalog.sortByNameAscending);
    await expect(productsPage.sortSelect).toHaveValue(catalog.sortByNameAscending);
    const expectedNamesAscending = [...filteredNames].sort((left, right) => left.localeCompare(right));
    await expect(productsPage.productNameLinks).toHaveText(expectedNamesAscending);

    // 5. Verify no-results behavior and restore the catalog.
    await productsPage.search(catalog.noMatchSearchTerm);
    await expect(productsPage.noProductsMessage(catalog.noMatchSearchTerm)).toBeVisible();
    await productsPage.clearFiltersButton.click();
    await expect(productsPage.resultSummary).toHaveText(catalog.expectedInitialCount);

    // 6. Inspect product details and available options.
    await productsPage.openProduct(catalog.productName);
    await expect(productDetailsPage.heading).toHaveText(catalog.productName);
    await expect(productDetailsPage.price).toHaveText(catalog.productPrice);
    await expect(productDetailsPage.stockStatus).toBeVisible();
    await expect(productDetailsPage.rating).toHaveText(catalog.productRating);
    await expect(productDetailsPage.descriptionTab).toBeVisible();
    await expect(productDetailsPage.reviewsTab).toBeVisible();
    await expect(productDetailsPage.shippingTab).toBeVisible();
    for (const color of catalog.availableColors) {
      await expect(productDetailsPage.colorOption(color)).toBeVisible();
    }
    await expect(productDetailsPage.quantityInput).toHaveValue('1');
  });
});
