import { defineStore } from 'pinia'
import type { Order } from '@/models/order'
import axios from 'axios'

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
      const query = {
        'ordersIds':orderIds
      }
      const  apiResponse = await axios.get('orders/get-orders', {params:query});

      if (apiResponse.status>=400){
        return Promise.reject()
      }
      return apiResponse.data.orders;
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
