import { defineStore } from 'pinia'
import type { Order } from '@/models/order'
import axios from 'axios'
import { useShopStore } from '@/stores/shop/shops'
import type { DeliveryMan } from '@/models/deliveryMan'
import type { OrderDelivery } from '@/models/orderDelivery'

export const useOrderStore = defineStore('orderStore',{
  state() {
      return {
        ordersId: null as number[]|null,
        loading: true,
        error: null as string|null,
      }
  },

  actions : {
    getLocalOrders(): void{
      this.loading = true;
      const ordersIDs = localStorage.getItem('orders');
      if (ordersIDs){
        this.ordersId =JSON.parse(ordersIDs);
      }
      this.loading=false;
    },

    addOrder(orderId:number):void{
      this.loading = true;
      if (this.ordersId){
        this.ordersId.push(orderId);
      }else{
        this.ordersId = [orderId];
      }
      localStorage.setItem('orders',JSON.stringify(this.ordersId));
      this.loading=false
    },

    async getOrder(orderIds:number[]):Promise<Order[]>{
      this.loading= true;
      const shopStore = useShopStore();
      if (shopStore.shop){
        const query = {
          'ordersIds':orderIds,
          'shop_id':shopStore.shop.id,
        }
        const  apiResponse = await axios.get('orders/get-orders', {params:query});

        if (apiResponse.status>=400){
          return Promise.reject()
        }
        return apiResponse.data.orders;
      }
      return Promise.reject()
    },

    async getDeliverymanInfo(order_reference:string):Promise<DeliveryMan>{
      this.loading= true;
      const shopStore = useShopStore();
      if(shopStore.shop){
        const query = {
          'order_reference':order_reference,
          'shop_id':shopStore.shop.id,
        }

        const apiResponse= await axios.get('orders/get-deliveryman-info',{params:query});
        if (apiResponse.status>=400){
          this.loading=false;
          return Promise.reject();
        }
        return apiResponse.data
      }
      this.loading=false;
      return Promise.reject();
    },

    async getOrderDeliveryInfos(orderReference:string):Promise<OrderDelivery>{
      this.loading=true;
      const shopStore = useShopStore();
      while (shopStore.loading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (shopStore.shop){
        const query = {
          'order_reference':orderReference,
          'shop_id':shopStore.shop.id,
        }
        const apiResponse = await axios.get('orders/get-delivery-info',{params:query});
        if (apiResponse.status>=400){
          return Promise.reject();
        }
        return apiResponse.data.order;
      }

      this.loading=false;
      return Promise.reject();
    },

    async setOrderAsDelivered (order_reference:string):Promise<boolean>{
      this.loading=true;
      const apiResponse = await axios.put(`orders/delivered-order/${order_reference}`);
      this.loading=false;
      return apiResponse.status <400
    },

    async cancelOrder(orderReference:string,secret:number):Promise<boolean>{
      this.loading=true;
      const query ={
        'order_reference':orderReference,
        'secret':secret,
      }

      const apiResponse = await axios.put('orders/cancel-order',query);
      this.loading=false;
      return apiResponse.status<400;
    },

    async verifyOrderPayment(orderReference:string,transactionId:string):Promise<boolean>{
      this.loading=true;

      const query = {
        'order_reference':orderReference,
        'transaction_id':transactionId,
      }
      const apiResponse = await axios.put('orders/finish-order',query);
      this.loading=false;

      return apiResponse.status<400;
    }

  }
})
