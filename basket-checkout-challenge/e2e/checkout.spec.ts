import { test, expect } from '@playwright/test';
import { PRODUCTS, VALID_CARD, addToBasket, setQuantity } from './helpers';

test.describe('Checkout page', () => {
  test('empty basket shows a message and continue shopping returns to products', async ({
    page,
  }) => {
    await page.goto('/checkout');

    await expect(page.getByTestId('empty-basket')).toBeVisible();
    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/\/products$/);
  });

  test('changing quantity updates the line total and grand total', async ({ page }) => {
    await page.goto('/products');
    await addToBasket(page, PRODUCTS.kettle.sku, 1); // $42.00
    await page.getByTestId('proceed-to-checkout').click();

    const line = page.getByTestId(`checkout-item-${PRODUCTS.kettle.sku}`);
    await expect(line.getByTestId('line-total')).toContainText('42.00');

    await setQuantity(page, PRODUCTS.kettle.sku, 3); // 3 × $42.00 = $126.00
    await expect(line.getByTestId('line-total')).toContainText('126.00');
    await expect(page.getByTestId('grand-total')).toContainText('126.00');
  });

  test('remove all clears just that line', async ({ page }) => {
    await page.goto('/products');
    await addToBasket(page, PRODUCTS.kettle.sku, 1);
    await addToBasket(page, PRODUCTS.mug.sku, 1);
    await page.getByTestId('proceed-to-checkout').click();

    const kettleLine = page.getByTestId(`checkout-item-${PRODUCTS.kettle.sku}`);
    await expect(kettleLine).toBeVisible();

    await kettleLine.getByTestId('remove-all').click();

    await expect(kettleLine).toHaveCount(0);
    await expect(page.getByTestId(`checkout-item-${PRODUCTS.mug.sku}`)).toBeVisible();
  });

  test('card number validation gates the checkout button', async ({ page }) => {
    await page.goto('/products');
    await addToBasket(page, PRODUCTS.kettle.sku, 1);
    await page.getByTestId('proceed-to-checkout').click();

    const submit = page.getByTestId('checkout-submit');
    await expect(submit).toBeDisabled();

    const input = page.getByTestId('card-number-input');
    await input.fill('123');
    await input.blur();
    await expect(page.getByTestId('card-error')).toBeVisible();
    await expect(submit).toBeDisabled();

    await input.fill(VALID_CARD);
    await expect(page.getByTestId('card-error')).toHaveCount(0);
    await expect(submit).toBeEnabled();
  });

  test('placing an order shows confirmation and clears the basket', async ({ page }) => {
    await page.goto('/products');
    await addToBasket(page, PRODUCTS.kettle.sku, 1);
    await page.getByTestId('proceed-to-checkout').click();

    await page.getByTestId('card-number-input').fill(VALID_CARD);
    await page.getByTestId('checkout-submit').click();

    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Thank you for your order' })).toBeVisible();

    await page.getByTestId('continue-shopping').click();
    await expect(page).toHaveURL(/\/products$/);
    // Order placement clears the in-memory basket:)
    await expect(page.getByTestId('basket-summary-items')).toContainText('Basket items: 0');
  });
});
