import type { Page } from '@/models/page'
import type { Product } from '@/models/product'

export interface Category {
  id:         number;
  name:       string;
  products?: Page<Product>;
}
