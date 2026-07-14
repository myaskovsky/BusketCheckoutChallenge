import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { BasketStore } from '../basket';
import { Product } from '../products/product.model';
import { Checkout } from './checkout';

const product: Product = {
  sku: 'CRD-001',
  name: 'Kettle',
  description: 'A kettle',
  price: 40,
  basketLimit: 3,
};

function checkoutButton(fixture: ComponentFixture<Checkout>): HTMLButtonElement {
  const buttons = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
  );
  return buttons.find((b) => b.textContent?.trim() === 'Checkout')!;
}

function cardInput(fixture: ComponentFixture<Checkout>): HTMLInputElement {
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('#card-number')!;
}

async function typeCard(fixture: ComponentFixture<Checkout>, value: string): Promise<void> {
  const input = cardInput(fixture);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();
}

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let store: InstanceType<typeof BasketStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [provideRouter([]), provideNoopAnimations()],
    }).compileComponents();

    store = TestBed.inject(BasketStore);
    store.clear();

    fixture = TestBed.createComponent(Checkout);
    await fixture.whenStable();
  });

  it('shows an empty message and no checkout button when the basket is empty', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Your basket is empty');
    expect(checkoutButton(fixture)).toBeUndefined();
  });

  it('keeps the checkout button disabled until a valid 16-digit card is entered', async () => {
    store.add(product);
    await fixture.whenStable();

    expect(checkoutButton(fixture).disabled).toBe(true);

    await typeCard(fixture, '4111');
    expect(checkoutButton(fixture).disabled).toBe(true);

    await typeCard(fixture, '4111111111111111');
    expect(checkoutButton(fixture).disabled).toBe(false);
  });

  it('flags an invalid card once the field has been touched', async () => {
    store.add(product);
    await fixture.whenStable();

    await typeCard(fixture, '123');
    cardInput(fixture).dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('16 digits');
  });

  it('confirms the order and clears the basket on checkout', async () => {
    store.add(product);
    await fixture.whenStable();

    await typeCard(fixture, '4111111111111111');
    checkoutButton(fixture).click();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Thank you for your order');
    expect(store.isEmpty()).toBe(true);
  });
});
