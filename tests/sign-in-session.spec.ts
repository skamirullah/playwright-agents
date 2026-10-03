import { expect, test } from '../fixtures/shop.fixture';
import { SHOP_TEST_DATA } from '../test-data/shopTestData';

test.describe('Nova Shop: Core Shopper Operations', () => {
  test('Sign in and manage the authenticated session', async ({ page, loginPage, productsPage }) => {
    const { standard, locked } = SHOP_TEST_DATA.accounts;

    // 1. Open the Nova Shop sign-in page.
    await loginPage.open();
    await expect(loginPage.welcomeHeading).toBeVisible();

    // 2. Submit blank credentials and verify sign-in is rejected.
    await loginPage.submitEmptyCredentials();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(page).toHaveURL(/\/shop\/?$/);

    // 3. Verify that a locked account cannot sign in.
    await loginPage.signIn(locked.username, locked.password);
    await expect(loginPage.lockedAccountError).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();

    // 4. Sign in with the standard demo account.
    await loginPage.signIn(standard.username, standard.password);
    await expect(productsPage.heading).toBeVisible();
    await expect(productsPage.accountName(standard.username)).toBeVisible();
    await expect(productsPage.ordersLink).toBeVisible();
    await expect(productsPage.cartLink).toHaveAttribute('aria-label', SHOP_TEST_DATA.cart.emptyCartLabel);

    // 5. Log out and verify the sign-in screen returns.
    await productsPage.logout();
    await expect(loginPage.welcomeHeading).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
