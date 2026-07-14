import { Product } from '../products/product.model';

export interface BasketItem {
  product: Product;
  quantity: number;
}
