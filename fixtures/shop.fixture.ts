import { test as base, expect } from '@playwright/test';
import { CartPage } from '../pages/shop/CartPage';
import { CheckoutPage } from '../pages/shop/CheckoutPage';
import { LoginPage } from '../pages/shop/LoginPage';
import { OrderConfirmationPage } from '../pages/shop/OrderConfirmationPage';
import { OrdersPage } from '../pages/shop/OrdersPage';
import { ProductDetailsPage } from '../pages/shop/ProductDetailsPage';
import { ProductsPage } from '../pages/shop/ProductsPage';

interface ShopFixtures {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  ordersPage: OrdersPage;
}

export const test = base.extend<ShopFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  productDetailsPage: async ({ page }, use) => use(new ProductDetailsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  orderConfirmationPage: async ({ page }, use) => use(new OrderConfirmationPage(page)),
  ordersPage: async ({ page }, use) => use(new OrdersPage(page)),
});

export { expect };
