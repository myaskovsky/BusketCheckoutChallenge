import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { BasketStore } from '../basket';
import { Product } from './product.model';
import { ProductList } from './product-list';

const products: Product[] = [
  { sku: 'CRD-001', name: 'Kettle', description: 'A kettle', price: 40, basketLimit: 2 },
  { sku: 'CRD-002', name: 'Grinder', description: 'A grinder', price: 90, basketLimit: 3 },
];

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof BasketStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    store = TestBed.inject(BasketStore);
    store.clear();

    fixture = TestBed.createComponent(ProductList);
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.tick();
    httpMock.expectOne('products.json').flush(products);
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('renders a card for each product', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Kettle');
    expect(text).toContain('Grinder');
  });

  it('adds a product to the basket and reflects it in the header', async () => {
    const addButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
    ).find((b) => b.textContent?.trim() === 'Add to Basket')!;

    addButton.click();
    await fixture.whenStable();

    expect(store.totalItems()).toBe(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('1 item');
  });
});
