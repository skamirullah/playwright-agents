import { Locator, Page } from '@playwright/test';
import { TEST_ENVIRONMENT } from '../../test-data/shopTestData';
import { ShopPage } from './ShopPage';

export class LoginPage extends ShopPage {
  readonly welcomeHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly lockedAccountError: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', { name: 'Welcome to Nova Shop' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByTestId('login-button');
    this.lockedAccountError = page.getByText('Sorry, this user has been locked out.');
  }

  async open(): Promise<void> {
    await this.page.goto(TEST_ENVIRONMENT.baseUrl);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async submitEmptyCredentials(): Promise<void> {
    await this.signInButton.click();
  }
}
