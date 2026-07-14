import { computed, Injectable, signal } from '@angular/core';

import { BasketItem, Product } from '@app/shared/models';

function clamp(quantity: number, limit: number): number {
  return Math.max(1, Math.min(quantity, limit));
}

@Injectable({ providedIn: 'root' })
export class BasketService {
  private readonly _items = signal<BasketItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((count, item) => count + item.quantity, 0),
  );

  readonly totalCost = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity * item.product.price, 0),
  );

  readonly quantities = computed(() => {
    const map = new Map<string, number>();
    for (const item of this._items()) {
      map.set(item.product.sku, item.quantity);
    }
    return map;
  });

  readonly isEmpty = computed(() => this._items().length === 0);

  add(product: Product): void {
    const items = this._items();
    const current = items.find((item) => item.product.sku === product.sku);

    if (!current) {
      this._items.set([...items, { product, quantity: 1 }]);
      return;
    }

    if (current.quantity >= product.basketLimit) {
      return;
    }

    this._items.set(
      items.map((item) =>
        item.product.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  remove(sku: string): void {
    const items = this._items();
    const current = items.find((item) => item.product.sku === sku);
    if (!current) {
      return;
    }

    if (current.quantity <= 1) {
      this._items.set(items.filter((item) => item.product.sku !== sku));
      return;
    }

    this._items.set(
      items.map((item) =>
        item.product.sku === sku ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  }

  setQuantity(sku: string, quantity: number): void {
    this._items.update((items) =>
      items.map((item) =>
        item.product.sku === sku
          ? { ...item, quantity: clamp(quantity, item.product.basketLimit) }
          : item,
      ),
    );
  }

  removeAll(sku: string): void {
    this._items.update((items) => items.filter((item) => item.product.sku !== sku));
  }

  clear(): void {
    this._items.set([]);
  }
}
