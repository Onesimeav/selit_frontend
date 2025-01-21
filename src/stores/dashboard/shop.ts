import { defineStore } from 'pinia'
import type { Shop } from '@/models/shop'
import axios from 'axios'

export const useDashboardShopStore = defineStore('dashboardShop',{
  state() {
      return{
        shops: null as Shop[] | null,
        loading:false,
        errorMessage:null as string | null,
      }
  },

  actions:{
    async getUserShops():Promise<void>{
      this.loading=true;
      const apiResponse = await axios.get('shops');
      this.loading=false;
      if(apiResponse.status<400){
        this.shops = apiResponse.data.shop;
      }
    }
  }
})
