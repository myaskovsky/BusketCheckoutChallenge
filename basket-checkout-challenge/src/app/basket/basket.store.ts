import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { Product } from '../products/product.model';
import { BasketItem } from './basket.model';

interface BasketState {
  items: BasketItem[];
}

const initialState: BasketState = {
  items: [],
};

function clamp(quantity: number, limit: number): number {
  return Math.max(1, Math.min(quantity, limit));
}

export const BasketStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    totalItems: computed(() => items().reduce((count, item) => count + item.quantity, 0)),
    totalCost: computed(() =>
      items().reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    ),
    quantities: computed(() => {
      const map = new Map<string, number>();
      for (const item of items()) {
        map.set(item.product.sku, item.quantity);
      }
      return map;
    }),
    isEmpty: computed(() => items().length === 0),
  })),
  withMethods((store) => ({
    add(product: Product): void {
      const items = store.items();
      const current = items.find((item) => item.product.sku === product.sku);

      if (!current) {
        patchState(store, { items: [...items, { product, quantity: 1 }] });
        return;
      }

      if (current.quantity >= product.basketLimit) {
        return;
      }

      patchState(store, {
        items: items.map((item) =>
          item.product.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
    },

    remove(sku: string): void {
      const items = store.items();
      const current = items.find((item) => item.product.sku === sku);
      if (!current) {
        return;
      }

      if (current.quantity <= 1) {
        patchState(store, { items: items.filter((item) => item.product.sku !== sku) });
        return;
      }

      patchState(store, {
        items: items.map((item) =>
          item.product.sku === sku ? { ...item, quantity: item.quantity - 1 } : item,
        ),
      });
    },

    setQuantity(sku: string, quantity: number): void {
      const items = store.items();
      patchState(store, {
        items: items.map((item) =>
          item.product.sku === sku
            ? { ...item, quantity: clamp(quantity, item.product.basketLimit) }
            : item,
        ),
      });
    },

    removeAll(sku: string): void {
      patchState(store, { items: store.items().filter((item) => item.product.sku !== sku) });
    },

    clear(): void {
      patchState(store, initialState);
    },
  })),
);
