import { Locator, Page } from '@playwright/test';
import { ShopPage } from './ShopPage';

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export class CheckoutPage extends ShopPage {
  readonly heading: Locator;
  readonly contactSectionHeading: Locator;
  readonly deliverySectionHeading: Locator;
  readonly paymentSectionHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipInput: Locator;
  readonly standardShippingOption: Locator;
  readonly expressShippingOption: Locator;
  readonly summaryShipping: Locator;
  readonly cardNameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvvInput: Locator;
  readonly cashOnDeliveryOption: Locator;
  readonly termsCheckbox: Locator;
  readonly placeOrderButton: Locator;
  readonly validationSummary: Locator;
  readonly firstNameError: Locator;
  readonly emailError: Locator;
  readonly termsError: Locator;
  readonly cardDeclinedMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Checkout', exact: true });
    this.contactSectionHeading = page.getByRole('heading', { name: /Contact & shipping address/ });
    this.deliverySectionHeading = page.getByRole('heading', { name: /Delivery/ });
    this.paymentSectionHeading = page.getByRole('heading', { name: /Payment/ });
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.emailInput = page.getByTestId('email');
    this.phoneInput = page.getByTestId('phone');
    this.addressInput = page.getByTestId('address');
    this.cityInput = page.getByTestId('city');
    this.stateSelect = page.getByTestId('state');
    this.zipInput = page.getByTestId('zip');
    this.standardShippingOption = page.getByTestId('shipping-standard');
    this.expressShippingOption = page.getByTestId('shipping-express');
    this.summaryShipping = page.getByTestId('summary-shipping');
    this.cardNameInput = page.getByTestId('card-name');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cardExpiryInput = page.getByTestId('card-expiry');
    this.cardCvvInput = page.getByTestId('card-cvv');
    this.cashOnDeliveryOption = page.locator('label:has(input[data-testid="payment-cod"])');
    this.termsCheckbox = page.getByTestId('accept-terms');
    this.placeOrderButton = page.getByTestId('place-order');
    this.validationSummary = page.getByText(/Please fix \d+ errors below/);
    this.firstNameError = page.getByText('First name is required');
    this.emailError = page.getByText('Enter a valid email address');
    this.termsError = page.getByText('You must accept the terms');
    this.cardDeclinedMessage = page.getByText('Your card was declined. Try a different card or choose Cash on delivery.');
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.addressInput.fill(details.address);
    await this.cityInput.fill(details.city);
    await this.stateSelect.selectOption(details.state);
    await this.zipInput.fill(details.zip);
  }

  async chooseExpressShipping(): Promise<void> {
    await this.expressShippingOption.check();
  }

  async chooseStandardShipping(): Promise<void> {
    await this.standardShippingOption.check();
  }

  async fillCardDetails(name: string, number: string, expiry: string, cvv: string): Promise<void> {
    await this.cardNameInput.fill(name);
    await this.cardNumberInput.fill(number);
    await this.cardExpiryInput.fill(expiry);
    await this.cardCvvInput.fill(cvv);
  }

  async chooseCashOnDelivery(): Promise<void> {
    await this.cashOnDeliveryOption.click();
  }

  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
