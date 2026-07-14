import { test, expect } from '@playwright/test';
import { PRODUCTS, addToBasket, card } from './helpers';

test.describe('Products page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('shows the product catalogue', async ({ page }) => {
    await expect(page.getByTestId('products-heading')).toHaveText('Products');
    await expect(page.locator('app-product-card')).toHaveCount(6);
  });

  test('adding a product updates its quantity and the basket summary', async ({ page }) => {
    const kettle = card(page, PRODUCTS.kettle.sku);
    await expect(kettle.getByTestId('product-quantity')).toHaveText('In basket: 0');

    await addToBasket(page, PRODUCTS.kettle.sku, 2);

    await expect(kettle.getByTestId('product-quantity')).toHaveText('In basket: 2');
    await expect(page.getByTestId('basket-summary-items')).toContainText('2 items');
    await expect(page.getByTestId('basket-summary-total')).toContainText('84.00');
  });

  test('remove is disabled until in basket, then decrements', async ({ page }) => {
    const grinder = card(page, PRODUCTS.grinder.sku);
    await expect(grinder.getByTestId('remove-from-basket')).toBeDisabled();

    await addToBasket(page, PRODUCTS.grinder.sku, 2);
    await expect(grinder.getByTestId('product-quantity')).toHaveText('In basket: 2');

    await grinder.getByTestId('remove-from-basket').click();
    await expect(grinder.getByTestId('product-quantity')).toHaveText('In basket: 1');
    await expect(grinder.getByTestId('remove-from-basket')).toBeEnabled();
  });

  test('enforces the per-product basket limit', async ({ page }) => {
    const grinder = card(page, PRODUCTS.grinder.sku); //  limit 3
    await addToBasket(page, PRODUCTS.grinder.sku, PRODUCTS.grinder.limit);

    await expect(grinder.getByTestId('product-quantity')).toHaveText(
      `In basket: ${PRODUCTS.grinder.limit}`,
    );
    await expect(grinder.getByTestId('add-to-basket')).toBeDisabled();
    await expect(grinder.getByTestId('limit-note')).toHaveText(
      `Limit of ${PRODUCTS.grinder.limit} reached`,
    );
  });

  test('proceeds to the checkout page', async ({ page }) => {
    await page.getByTestId('proceed-to-checkout').click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByTestId('checkout-heading')).toBeVisible();
  });
});
