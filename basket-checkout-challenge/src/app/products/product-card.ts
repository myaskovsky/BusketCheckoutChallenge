import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Product } from './product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatButtonModule, MatCardModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly quantity = input(0);

  readonly add = output<void>();
  readonly remove = output<void>();

  protected readonly atLimit = computed(() => this.quantity() >= this.product().basketLimit);
  protected readonly inBasket = computed(() => this.quantity() > 0);
}
