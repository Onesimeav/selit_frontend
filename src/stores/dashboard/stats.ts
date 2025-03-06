import { defineStore } from 'pinia'
import axios from 'axios'
import type { Stats } from '@/models/stats'

export const useStatsStore = defineStore('statsStore',{
  state() {
      return {
        loading: false,
        errorMessage: null as string|null
      }
  },

  actions:{
    async getUserTotalOrders(shopId?:number):Promise<number>{
      this.loading=true;
      const query : {[key:string]:number} = {}
      if (shopId){
        query.shop_id=shopId;
      }
      const apiResponse = query && Object.keys(query).length
        ? await axios.get('stats/total-orders', { params:query })
        : await axios.get('stats/total-orders')

      this.loading=false
      if(apiResponse.status<400){
        return apiResponse.data.total_orders
      }
      return Promise.reject();
    },

    async getAnnualRevenueRate(shopId?:number):Promise<number>{
      this.loading=true;
      const query : {[key:string]:number} = {}
      if (shopId){
        query.shop_id=shopId;
      }
      const apiResponse = query && Object.keys(query).length
        ? await axios.get('stats/annual-revenue-rate', { params:query })
        : await axios.get('stats/annual-revenue-rate')

      this.loading = false;

      if (apiResponse.status<400){
        return apiResponse.data.total_price
      }
      return Promise.reject();
    },

    async getTotalOrderEvolution(shopId:number,period?:string):Promise<Stats[]>{
      this.loading=true;
      const query :{[key:string]:number|string} = {
        shop_id:shopId,
      }
      if (period){
        query.period=period;
      }
      const apiResponse = await axios.get('stats/total-order-evolution',{params:query});
      this.loading = false;
      if (apiResponse.status<400){
        return apiResponse.data.result
      }
      return Promise.reject();
    },

    async getTotalRevenueEvolution(shopId:number,period?:string):Promise<Stats[]>{
      this.loading= true;
      const query :{[key:string]:number|string} = {
        shop_id:shopId,
      }
      if (period){
        query.period=period;
      }
      const apiResponse = await axios.get('stats/total-revenue-evolution', { params:query });

      this.loading = false;
      if (apiResponse.status<400){
        return apiResponse.data.result
      }
      return Promise.reject();
    }
  }
})
