import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { form, pattern, required } from '@angular/forms/signals';

import { BasketService } from '@app/core/state';
import { CheckoutItem } from './components/checkout-item/checkout-item';

const CARD_DIGITS = 16;

function mask(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, CARD_DIGITS)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, CheckoutItem],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  protected readonly basket = inject(BasketService);
  protected readonly orderPlaced = signal(false);

  protected readonly cardDisplay = signal('');

  private readonly card = signal('');
  protected readonly cardField = form(this.card, (path) => {
    required(path, { message: 'Enter your card number' });
    pattern(path, /^\d{16}$/, { message: 'Card number must be 16 digits' });
  });

  protected readonly showCardError = computed(
    () => this.cardField().touched() && this.cardField().invalid(),
  );

  protected readonly cardErrorMessage = computed(
    () => this.cardField().errors()[0]?.message ?? '',
  );

  protected readonly canCheckout = computed(
    () => !this.basket.isEmpty() && this.cardField().valid(),
  );

  protected updateQuantity(sku: string, quantity: number): void {
    this.basket.setQuantity(sku, quantity);
  }

  protected removeAll(sku: string): void {
    this.basket.removeAll(sku);
  }

  protected onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = mask(input.value);
    this.cardDisplay.set(masked);
    input.value = masked;
    this.card.set(masked.replace(/\D/g, ''));
  }

  protected markCardTouched(): void {
    this.cardField().markAsTouched();
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
