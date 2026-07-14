import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  readonly products = httpResource<Product[]>(() => 'products.json', { defaultValue: [] });
}
