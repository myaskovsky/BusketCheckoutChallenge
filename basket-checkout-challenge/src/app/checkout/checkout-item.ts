import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BasketItem } from '../basket';

@Component({
  selector: 'app-checkout-item',
  imports: [CurrencyPipe, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './checkout-item.html',
  styleUrl: './checkout-item.scss',
  host: { '[attr.data-testid]': "'checkout-item-' + item().product.sku" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutItem {
  readonly item = input.required<BasketItem>();

  readonly quantityChange = output<number>();
  readonly removeAll = output<void>();

  protected readonly quantities = computed(() =>
    Array.from({ length: this.item().product.basketLimit }, (_, index) => index + 1),
  );

  protected readonly lineTotal = computed(() => this.item().quantity * this.item().product.price);

  protected onQuantityChange(value: number): void {
    this.quantityChange.emit(value);
  }
}
