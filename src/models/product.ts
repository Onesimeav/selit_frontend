import type { Media } from '@/models/media'
import type { Specification } from '@/models/specification'
import type { Promotion } from '@/models/promotion'

export interface Product {
  id:                    number;
  name:                  string;
  description:           string;
  price:                 number;
  owner_id:              number;
  shop_id:               number;
  medias:                Media[];
  specifications:        Specification[];
  auto_apply_promotions: Promotion[];
}
