import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormValueControl, transformedValue } from '@angular/forms/signals';

const CARD_DIGITS = 16;

/** Strip non-digits, cap at 16, and group into blocks of four, e.g. `4242 4242 4242 4242`. */
function mask(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, CARD_DIGITS)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * A masked card-number field that integrates with Signal Forms via {@link FormValueControl}.
 *
 * The underlying model holds raw digits; `transformedValue` formats them into groups of four for
 * display and parses user input back to digits. Bind it with the `FormField` directive:
 * `<app-card-number-input [formField]="cardField" />`.
 */
@Component({
  selector: 'app-card-number-input',
  templateUrl: './card-number-input.html',
  styleUrl: './card-number-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardNumberInput implements FormValueControl<string> {
  /** Raw card digits, kept in sync with the bound field's value by the `FormField` directive. */
  readonly value = model.required<string>();
  /** Touched state, synced back to the field when the input blurs. */
  readonly touched = model(false);
  /** Field validity, pushed in by the `FormField` directive. */
  readonly invalid = input(false);

  /** The masked, user-facing representation of the raw digits. */
  protected readonly display = transformedValue(this.value, {
    parse: (raw: string) => ({ value: raw.replace(/\D/g, '').slice(0, CARD_DIGITS) }),
    format: (digits: string) => mask(digits),
  });

  protected readonly showError = computed(() => this.touched() && this.invalid());

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Mask first: `display.set` stores the raw string as an explicit override that wins over the
    // formatted value, so we must feed it the already-masked text rather than reading it back.
    const masked = mask(input.value);
    this.display.set(masked);
    // Reflect the masked value immediately, even when stripping chars leaves the model unchanged.
    input.value = masked;
  }

  protected markTouched(): void {
    this.touched.set(true);
  }
}
