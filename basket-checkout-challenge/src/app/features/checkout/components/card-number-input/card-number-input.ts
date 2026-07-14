import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CARD_DIGITS = 16;

function mask(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, CARD_DIGITS)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

@Component({
  selector: 'app-card-number-input',
  templateUrl: './card-number-input.html',
  styleUrl: './card-number-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardNumberInput),
      multi: true,
    },
  ],
})
export class CardNumberInput implements ControlValueAccessor {
  readonly invalid = input(false);

  protected readonly display = signal('');
  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {
    /* noop until registered */
  };
  private onTouched: () => void = () => {
    /* noop until registered */
  };

  writeValue(value: string | null): void {
    this.display.set(mask(value ?? ''));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = mask(input.value);
    this.display.set(masked);
    input.value = masked;
    this.onChange(masked.replace(/\D/g, ''));
  }

  protected markTouched(): void {
    this.onTouched();
  }
}
