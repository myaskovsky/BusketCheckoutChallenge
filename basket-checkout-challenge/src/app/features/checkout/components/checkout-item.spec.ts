import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatSelectHarness } from '@angular/material/select/testing';

import { BasketItem } from '@app/shared/models';
import { CheckoutItem } from './checkout-item';

const item: BasketItem = {
  product: {
    sku: 'CRD-002',
    name: 'Burr Grinder',
    description: 'A grinder',
    price: 25,
    basketLimit: 4,
  },
  quantity: 2,
};

describe('CheckoutItem', () => {
  let fixture: ComponentFixture<CheckoutItem>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutItem],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutItem);
    fixture.componentRef.setInput('item', item);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('shows the name and the line total (quantity * price)', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Burr Grinder');
    expect(text).toContain('$50.00');
  });

  it('offers quantities from 1 up to the basket limit', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();

    expect(options.length).toBe(item.product.basketLimit);
    expect(await options[0].getText()).toBe('1');
    expect(await options[3].getText()).toBe('4');
  });

  it('emits the new quantity when a different option is chosen', async () => {
    let emitted: number | undefined;
    fixture.componentInstance.quantityChange.subscribe((value) => (emitted = value));

    const select = await loader.getHarness(MatSelectHarness);
    await select.clickOptions({ text: '4' });

    expect(emitted).toBe(4);
  });

  it('emits removeAll when the Remove all button is pressed', () => {
    let removed = false;
    fixture.componentInstance.removeAll.subscribe(() => (removed = true));

    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    button.click();

    expect(removed).toBe(true);
  });
});
