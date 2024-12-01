export interface OrderDelivery {
  id:                  number;
  order_reference:     string;
  name:                string;
  surname:             string;
  email:               string;
  number:              number;
  address:             string;
  location_latitude:   number;
  location_longitude:  number;
  status:              string;
  deliveryman_mail:    string;
  deliveryman_name:    string;
  deliveryman_surname: string;
  deliveryman_number:  number;
  shop_id:             number;
}
