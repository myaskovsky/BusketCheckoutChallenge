import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BasketStore } from '../basket';
import { Product } from './product.model';
import { ProductCard } from './product-card';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productsService = inject(ProductsService);
  protected readonly basket = inject(BasketStore);

  protected readonly products = this.productsService.products;

  protected quantityOf(sku: string): number {
    return this.basket.quantities().get(sku) ?? 0;
  }

  protected addToBasket(product: Product): void {
    this.basket.add(product);
  }

  protected removeFromBasket(product: Product): void {
    this.basket.remove(product.sku);
  }
}
