# Basket & Checkout

A small two-view shopping app built with Angular and NgRx. Products are loaded
from static mock data; a shopping basket is kept in a shared store and can be
managed and checked out.

## Views

- **Product list** (`/products`)
- **Checkout** (`/checkout`)

## Commands

```bash
npm start          # dev server on http://localhost:4200
npm run build      # production build
npm test           # unit tests (Vitest)
npm run e2e        # e2e tests (Playwright)
npm run e2e:ui     # e2e tests in interactive UI mode
npm run lint       # ESLint
```

## Stack

- Angular 21, standalone components, zoneless change detection, all `OnPush`.
- [`@ngrx/signals`](https://ngrx.io/guide/signals) signal store for basket state.
- Angular Material for the UI.
- Signal forms for the card-number validation.
- Product data is served as a static asset (`public/products.json`) and read
  through `ProductsService` with `httpResource`.

## Structure

State and views are grouped by feature, each with a barrel `index.ts`:

```
src/app/
  basket/     shared basket signal store + model
  products/   product list container, product card, products service
  checkout/   checkout container, checkout row component
```
