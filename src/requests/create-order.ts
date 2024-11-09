export interface CreateOrder {
  shop_id:  number;
  name:     string;
  surname:  string;
  email:    string;
  number:   number;
  products: CartProductRequest[];
}

export interface CartProductRequest {
  product_id:   number;
  quantity:     number;
  promotion_id?: number[];
}
