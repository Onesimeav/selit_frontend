export interface Order {
  id:              number;
  order_reference: string;
  name:            string;
  surname:         string;
  email:           string;
  number:          number;
  address:         string;
  location_latitude:number;
  location_longitude:number;
  status:          string;
  shop_id:         number;
  orderProducts:   OrderProduct[];
}

export interface OrderProduct {
  order_id:                number;
  product_id:              number;
  id:                      number;
  product_name:            string;
  product_price:           number;
  product_quantity:        number;
  price_promotion_applied: number;
  promotion_code:          string[];
}
