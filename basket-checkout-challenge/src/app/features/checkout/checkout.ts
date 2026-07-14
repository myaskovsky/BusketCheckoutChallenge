import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { form, FormField, pattern, required } from '@angular/forms/signals';

import { BasketService } from '@app/core/state';
import { CheckoutItem } from './components/checkout-item/checkout-item';
import { CardNumberInput } from './components/card-number-input/card-number-input';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, FormField, CheckoutItem, CardNumberInput],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  protected readonly basket = inject(BasketService);
  protected readonly orderPlaced = signal(false);

  private readonly card = signal('');
  protected readonly cardField = form(this.card, (path) => {
    required(path, { message: 'Enter your card number' });
    pattern(path, /^\d{16}$/, { message: 'Card number must be 16 digits' });
  });

  protected readonly showCardError = computed(
    () => this.cardField().touched() && this.cardField().invalid(),
  );

  protected readonly cardErrorMessage = computed(() => {
    const errors = this.cardField().errors();
    if (errors.some((error) => error.kind === 'required')) {
      return 'Enter your card number';
    }
    if (errors.some((error) => error.kind === 'pattern')) {
      return 'Card number must be 16 digits';
    }
    return '';
  });

  protected readonly canCheckout = computed(
    () => !this.basket.isEmpty() && this.cardField().valid(),
  );

  protected updateQuantity(sku: string, quantity: number): void {
    this.basket.setQuantity(sku, quantity);
  }

  protected removeAll(sku: string): void {
    this.basket.removeAll(sku);
  }

  protected placeOrder(): void {
    this.cardField().markAsTouched();
    if (this.cardField().invalid() || this.basket.isEmpty()) {
      return;
    }
    this.orderPlaced.set(true);
    this.basket.clear();
  }
}
