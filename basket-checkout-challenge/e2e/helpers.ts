import { Page } from '@playwright/test';

// Helpers and fixtures for the e2e suite

export const VALID_CARD = '4242424242424242';

export const PRODUCTS = {
  kettle: { sku: 'CRD-001', name: 'Cascade Pour-Over Kettle', price: 42.0, limit: 5 },
  grinder: { sku: 'CRD-002', name: 'Burr Coffee Grinder', price: 89.5, limit: 3 },
  mug: { sku: 'CRD-003', name: 'Double-Wall Glass Mug', price: 14.75, limit: 10 },
} as const;

export function card(page: Page, sku: string) {
  return page.getByTestId(`product-card-${sku}`);
}

export async function addToBasket(page: Page, sku: string, times = 1): Promise<void> {
  const add = card(page, sku).getByTestId('add-to-basket');
  for (let i = 0; i < times; i++) {
    await add.click();
  }
}

export async function setQuantity(page: Page, sku: string, quantity: number): Promise<void> {
  await page.getByTestId(`checkout-item-${sku}`).getByTestId('quantity-select').click();
  await page.getByRole('option', { name: String(quantity), exact: true }).click();
}
