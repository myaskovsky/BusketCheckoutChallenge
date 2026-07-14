import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Product } from '@app/shared/models';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, MatTooltipModule],
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
  protected readonly limitMessage = computed(() => `Limit of ${this.product().basketLimit} reached`);
}
