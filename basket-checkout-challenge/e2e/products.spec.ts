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

  test('adding a product updates the basket summary', async ({ page }) => {
    await expect(page.getByTestId('basket-summary-items')).toContainText('0 items');

    await addToBasket(page, PRODUCTS.kettle.sku, 2);

    await expect(page.getByTestId('basket-summary-items')).toContainText('2 items');
    await expect(page.getByTestId('basket-summary-total')).toContainText('84.00');
  });

  test('remove is disabled until in basket, then decrements', async ({ page }) => {
    const grinder = card(page, PRODUCTS.grinder.sku);
    await expect(grinder.getByTestId('remove-from-basket')).toBeDisabled();

    await addToBasket(page, PRODUCTS.grinder.sku, 2);
    await expect(page.getByTestId('basket-summary-items')).toContainText('2 items');

    await grinder.getByTestId('remove-from-basket').click();
    await expect(page.getByTestId('basket-summary-items')).toContainText('1 item');
    await expect(grinder.getByTestId('remove-from-basket')).toBeEnabled();
  });

  test('enforces the per-product basket limit', async ({ page }) => {
    const grinder = card(page, PRODUCTS.grinder.sku); //  limit 3
    await addToBasket(page, PRODUCTS.grinder.sku, PRODUCTS.grinder.limit);

    await expect(page.getByTestId('basket-summary-items')).toContainText(
      `${PRODUCTS.grinder.limit} items`,
    );
    await expect(grinder.getByTestId('add-to-basket')).toBeDisabled();

    await grinder.getByTestId('limit-tooltip').hover();
    await expect(page.getByRole('tooltip')).toHaveText(
      `Limit of ${PRODUCTS.grinder.limit} reached`,
    );
  });

  test('proceeds to the checkout page', async ({ page }) => {
    await page.getByTestId('proceed-to-checkout').click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByTestId('checkout-heading')).toBeVisible();
  });
});
