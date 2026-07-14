# Challenge README

**The solution is built inside the [`basket-checkout-challenge/`](./basket-checkout-challenge) directory alongside this challenge-README.md file.**

_Notes to help the reviewer run or understand the solution._

## Running the solution

```bash
cd basket-checkout-challenge
npm install
npm start          # dev server on http://localhost:4200
npm run build      # production build
npm test           # unit tests (Vitest)
npm run e2e        # e2e tests (Playwright)
npm run lint       # ESLint
```

The two views are available at `/products` (Product List) and `/checkout` (Basket
Checkout). See [`basket-checkout-challenge/README.md`](./basket-checkout-challenge/README.md)
for the full stack and folder structure.

## AI Usage

AI was used as a helper for writing unit and e2e tests.

### Why I used AI

I used AI to double check which unit test cases would be useful for the NgRx basket
signal store, its selectors, and the card-number validation. The goal was to avoid
missing simple edge cases such as basket limits, removing the last item, and invalid
card number formats.

### Prompt used

I am working on a small Angular and NgRx Signal Store shopping basket challenge.

Please help me write practical Vitest unit tests for the existing logic:

- basket signal store methods (add, remove, setQuantity, removeAll),
- basket selectors (total item count and total cost),
- card number validation - valid only when the value is exactly 16 digits

Focus on useful edge cases:

- basketLimit should not be exceeded when adding a product
- removing the last item should remove that product from the basket
- setQuantity should respect the valid quantity range (1 to basketLimit)
- totals should be calculated from quantity multiplied by price
- invalid card numbers should be rejected

Please also help me write Playwright e2e tests covering the product-list and
checkout flows:

- adding and removing products updates the quantity and basket summary
- the per-product basket limit is enforced in the UI
- changing quantity updates the line total and grand total
- remove all clears only that product line
- card number validation gates the checkout button
- placing an order shows confirmation and clears the basket

Keep the tests simple and aligned with the challenge requirements.

### Scope

AI was used for test planning and coverage ideas. The solution was reviewed manually.
