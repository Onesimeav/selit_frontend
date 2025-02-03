export  interface  CreatePromotion {
  name : string,
  autoApply : boolean,
  duration : number,
  value : number,
  shop_id : number,
  active ?: boolean,
}
