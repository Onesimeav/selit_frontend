export interface CreateOrder {
  shop_id:  string;
  name:     string;
  surname:  string;
  email:    string;
  number:   string;
  products: Product[];
}

export interface Product {
  product_id:   string;
  quantity:     string;
  promotion_id: number[];
}
