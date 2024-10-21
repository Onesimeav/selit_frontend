export interface Shop {
  id:           number;
  name:         string;
  description:  string;
  logo:         string;
  banner:       string;
  product_type: 'virtual'|'physic';
  subdomain:    string;
  publish:      boolean;
  owner_id:     number;
  template_id:  number;
}
