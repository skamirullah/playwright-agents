interface ShippingDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export type TestEnvironmentName = 'qa' | 'stage';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnvironmentName(): TestEnvironmentName {
  const value = process.env.TEST_ENV?.trim().toLowerCase() || 'qa';
  if (value !== 'qa' && value !== 'stage') {
    throw new Error(`Unsupported TEST_ENV "${value}". Use "qa" or "stage".`);
  }
  return value;
}

const environmentName = getEnvironmentName();
const environmentPrefix = environmentName.toUpperCase();
const configuredBaseUrl = process.env[`${environmentPrefix}_BASE_URL`]?.trim();

export const TEST_ENVIRONMENT = {
  name: environmentName,
  baseUrl: configuredBaseUrl || (environmentName === 'qa'
    ? 'https://www.practiceqaautomation.com/shop'
    : getRequiredEnvironmentVariable(`${environmentPrefix}_BASE_URL`)),
};

try {
  const parsedBaseUrl = new URL(TEST_ENVIRONMENT.baseUrl);
  if (!['http:', 'https:'].includes(parsedBaseUrl.protocol)) {
    throw new Error('Expected an HTTP(S) URL.');
  }
} catch {
  throw new Error(`${environmentPrefix}_BASE_URL must be a valid absolute HTTP(S) URL.`);
}

export const SHOP_TEST_DATA = {
  accounts: {
    standard: {
      username: process.env[`${environmentPrefix}_STANDARD_USERNAME`]?.trim() || 'demo_user',
      get password(): string {
        return getRequiredEnvironmentVariable(`${environmentPrefix}_STANDARD_PASSWORD`);
      },
    },
    locked: {
      username: process.env[`${environmentPrefix}_LOCKED_USERNAME`]?.trim() || 'locked_user',
      get password(): string {
        return getRequiredEnvironmentVariable(`${environmentPrefix}_LOCKED_PASSWORD`);
      },
    },
  },
  catalog: {
    productName: 'Aurora Wireless Headphones',
    searchTerm: 'headphones',
    noMatchSearchTerm: 'zz-no-product-match',
    category: 'Electronics',
    expectedInitialCount: 'Showing 12 of 12 products',
    expectedSearchCount: 'Showing 1 of 12 products',
    sortByPriceAscending: 'price-asc',
    sortByNameAscending: 'name-asc',
    productPrice: '$129.99',
    productRating: '4.6',
    initialQuantity: '1',
    defaultColor: 'Midnight',
    availableColors: ['Midnight', 'Lilac', 'Snow'],
  },
  cart: {
    color: 'Lilac',
    initialQuantity: 2,
    increasedQuantity: 3,
    initialItemCount: '2 items',
    increasedItemCount: '3 items',
    initialCartLabel: 'Cart with 2 items',
    singleItemCartLabel: 'Cart with 1 items',
    emptyCartLabel: 'Cart with 0 items',
    initialLineTotal: '$259.98',
    increasedLineTotal: '$389.97',
    coupon: {
      invalid: 'BADCODE',
      valid: 'SAVE10',
      invalidMessage: 'not a valid coupon',
      discountMessage: '10% off your order',
      discountAmount: '−$26.00',
    },
  },
  checkout: {
    expressShippingCost: '$15.00',
    declinedCard: {
      name: 'Taylor Jordan',
      number: '4000000000000002',
      expiry: '12/29',
      cvv: '123',
    },
    expressShippingDetails: {
      firstName: 'Taylor',
      lastName: 'Jordan',
      email: 'taylor.jordan@example.com',
      phone: '5551234567',
      address: '42 Demo Street',
      city: 'Austin',
      state: 'Texas',
      zip: '78701',
    } satisfies ShippingDetailsData,
    orderHistoryShippingDetails: {
      firstName: 'Morgan',
      lastName: 'Lee',
      email: 'morgan.lee@example.com',
      phone: '5559876543',
      address: '18 Oak Avenue',
      city: 'Austin',
      state: 'Texas',
      zip: '78701',
    } satisfies ShippingDetailsData,
    expectedItemCount: '1',
    expressDeliveryLabel: 'express',
    paymentMethodLabel: 'Cash on delivery',
    orderStatus: 'Processing',
  },
} as const;
