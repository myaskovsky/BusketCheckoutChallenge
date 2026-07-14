import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormField, form, pattern, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { BasketStore } from '../basket';
import { CheckoutItem } from './checkout-item';

@Component({
  selector: 'app-checkout',
  imports: [
    CurrencyPipe,
    RouterLink,
    FormField,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CheckoutItem,
  ],
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
