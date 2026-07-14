import { TestBed } from '@angular/core/testing';

import { Product } from '../products/product.model';
import { BasketStore } from './basket.store';

const kettle: Product = {
  sku: 'CRD-001',
  name: 'Kettle',
  description: 'A kettle',
  price: 40,
  basketLimit: 3,
};

const mug: Product = {
  sku: 'CRD-003',
  name: 'Mug',
  description: 'A mug',
  price: 10,
  basketLimit: 5,
};

describe('BasketStore', () => {
  let store: InstanceType<typeof BasketStore>;

  beforeEach(() => {
    store = TestBed.inject(BasketStore);
  });

  it('starts empty', () => {
    expect(store.items()).toEqual([]);
    expect(store.totalItems()).toBe(0);
    expect(store.totalCost()).toBe(0);
    expect(store.isEmpty()).toBe(true);
  });

  it('adds a product and increments its quantity', () => {
    store.add(kettle);
    store.add(kettle);

    expect(store.quantities().get(kettle.sku)).toBe(2);
    expect(store.totalItems()).toBe(2);
    expect(store.totalCost()).toBe(80);
  });

  it('does not add beyond the product basketLimit', () => {
    for (let i = 0; i < 10; i++) {
      store.add(kettle);
    }

    expect(store.quantities().get(kettle.sku)).toBe(kettle.basketLimit);
  });

  it('decrements and drops the item when it reaches zero', () => {
    store.add(mug);
    store.add(mug);
    store.remove(mug.sku);
    expect(store.quantities().get(mug.sku)).toBe(1);

    store.remove(mug.sku);
    expect(store.quantities().has(mug.sku)).toBe(false);
    expect(store.isEmpty()).toBe(true);
  });

  it('clamps a requested quantity to the range 1..basketLimit', () => {
    store.add(kettle);

    store.setQuantity(kettle.sku, 99);
    expect(store.quantities().get(kettle.sku)).toBe(kettle.basketLimit);

    store.setQuantity(kettle.sku, 0);
    expect(store.quantities().get(kettle.sku)).toBe(1);
  });

  it('removes a product entirely with removeAll', () => {
    store.add(kettle);
    store.add(mug);

    store.removeAll(kettle.sku);

    expect(store.quantities().has(kettle.sku)).toBe(false);
    expect(store.quantities().get(mug.sku)).toBe(1);
  });

  it('totals across multiple products', () => {
    store.add(kettle); // 40
    store.add(mug);    // 10
    store.add(mug);    // 10

    expect(store.totalItems()).toBe(3);
    expect(store.totalCost()).toBe(60);
  });
});
