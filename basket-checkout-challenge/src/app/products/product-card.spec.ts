import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { Product } from './product.model';
import { ProductCard } from './product-card';

const product: Product = {
  sku: 'CRD-001',
  name: 'Cascade Kettle',
  description: 'A precise pour-over kettle',
  price: 42,
  basketLimit: 3,
};

function buttonByText(fixture: ComponentFixture<ProductCard>, text: string): HTMLButtonElement {
  const buttons = Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
  );
  return buttons.find((b) => b.textContent?.trim() === text)!;
}

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.componentRef.setInput('quantity', 0);
    await fixture.whenStable();
  });

  it('shows the product details', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Cascade Kettle');
    expect(text).toContain('A precise pour-over kettle');
    expect(text).toContain('$42.00');
  });

  it('emits add when the Add to Basket button is pressed', () => {
    let added = 0;
    fixture.componentInstance.add.subscribe(() => added++);

    buttonByText(fixture, 'Add to Basket').click();

    expect(added).toBe(1);
  });

  it('emits remove when the Remove Basket button is pressed', async () => {
    fixture.componentRef.setInput('quantity', 1);
    await fixture.whenStable();

    let removed = 0;
    fixture.componentInstance.remove.subscribe(() => removed++);

    buttonByText(fixture, 'Remove Basket').click();

    expect(removed).toBe(1);
  });

  it('disables the Remove Basket button when nothing is in the basket', () => {
    expect(buttonByText(fixture, 'Remove Basket').disabled).toBe(true);
  });

  it('disables adding once the basket limit is reached', async () => {
    fixture.componentRef.setInput('quantity', product.basketLimit);
    await fixture.whenStable();

    expect(buttonByText(fixture, 'Add to Basket').disabled).toBe(true);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Limit of 3 reached');
  });
});
