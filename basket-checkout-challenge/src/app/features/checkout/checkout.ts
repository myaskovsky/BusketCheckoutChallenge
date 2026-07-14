import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormField, form, maxLength, pattern, required, submit } from '@angular/forms/signals';

import { BasketStore } from '@app/core/state';
import { CheckoutItem } from './components/checkout-item';
import { CardNumberInput } from './components/card-number-input';

const CARD_DIGITS = 16;

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, FormField, CheckoutItem, CardNumberInput],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  protected readonly basket = inject(BasketStore);
  protected readonly orderPlaced = signal(false);

  private readonly payment = signal({ cardNumber: '' });
  protected readonly paymentForm = form(this.payment, (path) => {
    required(path.cardNumber, { message: 'Enter your card number' });
    maxLength(path.cardNumber, CARD_DIGITS, { message: 'Card number must be 16 digits' });
    pattern(path.cardNumber, /^\d{16}$/, { message: 'Card number must be 16 digits' });
  });

  protected readonly cardField = this.paymentForm.cardNumber;

  protected readonly showCardError = computed(() => {
    const state = this.cardField();
    return state.touched() && state.invalid();
  });

  protected readonly canCheckout = computed(
    () => !this.basket.isEmpty() && this.paymentForm().valid(),
  );

  protected updateQuantity(sku: string, quantity: number): void {
    this.basket.setQuantity(sku, quantity);
  }

  protected removeAll(sku: string): void {
    this.basket.removeAll(sku);
  }

  protected placeOrder(): void {
    submit(this.paymentForm, async () => {
      this.orderPlaced.set(true);
      this.basket.clear();
    });
  }
}
