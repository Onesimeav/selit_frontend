import { defineStore } from 'pinia'
import type { Order } from '@/models/order'
import axios from 'axios'
import type { Page } from '@/models/page'
import type { DeliveryMan } from '@/models/deliveryMan'

export const useDashboardOrderStore = defineStore('dashboard-order',{
  state() {
      return{
        orders : null as Page<Order>| null,
        loading : false,
        errorMessage : null as string| null
      }
  },

  actions:{
    async getOrders (search?:string,shopId?:number,status?:string,page?:number){
      this.loading = true;
      const query : {[key:string]:string|number} = {};
      if (search) query.search = search;
      if (shopId) query.shop_id = shopId;
      if (status) query.status = status;

      const url = page?`orders/?page=${page}`:'orders';

      const apiResponse = query && Object.keys(query).length
        ? await  axios.get(url,{params:query})
        : await axios.get(url);

      this.loading = false;

      if (apiResponse.status<400){
        if (page){
          if (!this.orders){
            this.orders = apiResponse.data.result;
          }else {
            const formatedResponse : Page<Order> = apiResponse.data.result;
            this.orders.total = formatedResponse.total;
            this.orders.per_page = formatedResponse.per_page;
            this.orders.data = [
              ...this.orders.data,
              ...formatedResponse.data,
            ]
          }
        }else {
          this.orders = apiResponse.data.result;
        }
      }

    },

    async getOrder(orderId:number):Promise<Order[]>{
      this.loading = true;
      const query = {
        ordersIds:[orderId]
      };
      const apiResponse = await axios.get('orders/get-orders',{params:query});

      if(apiResponse.status<400){
        return apiResponse.data.orders
      }else{
        return Promise.reject()
      }
    },

    async approveOrder (orderId:number):Promise<boolean>{
      this.loading = true;
      const apiResponse = await axios.put(`orders/approve-order/${orderId}`);
      this.loading = false;
      return apiResponse.status<400;
    },

    async deliverOrder(orderId:number,deliverymanEmail:string,deliverymanName:string,deliverymanSurname:string,deliverymanNumber:number):Promise<boolean>{
      this.loading=true;
      const query = {
        order_id:orderId,
        deliveryman_email:deliverymanEmail,
        deliveryman_name:deliverymanName,
        deliveryman_surname:deliverymanSurname,
        deliveryman_number:deliverymanNumber,
      }

      const apiResponse = await axios.put('orders/delivery-order',query);

      this.loading= false;

      return apiResponse.status<400;
    },

    async cancelOrder(orderReference:string):Promise<boolean>{
      this.loading=true;
      const query = {
        order_reference:orderReference
      }
      const apiResponse = await axios.put('orders/cancel-order',query);
      this.loading=false;
      return  apiResponse.status<400
    },

    async getOrderInvoice(orderReference:string):Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.get(`orders/get-invoice/${orderReference}`);
      this.loading=false;
      return  apiResponse.status<400;
    },

    async getDeliveryMan(orderReference:string,shopId:number):Promise<DeliveryMan>{
      this.loading=true;
      const query = {
        order_reference:orderReference,
        shop_id:shopId,
      }
      const apiResponse = await axios.get('orders/get-deliveryman-info',{params:query});
      this.loading=false;
      if (apiResponse.status<400){
        return apiResponse.data
      }else{
        return Promise.reject()
      }
    }
  }
})
