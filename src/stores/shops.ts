import { defineStore } from 'pinia'
import type { Shop } from '@/models/shop'
import type { Product } from '@/models/product'
import axios from 'axios'

export const useShopStore = defineStore('shop',{
  state() {
      return{
        shop:null as Shop|null,
        products:[] as Product[]|null,
        published:null as boolean|null,
        loading:false,
        error:null as string|null,
      }
  },
  actions:{
    async getShop(domain:string):Promise<boolean>{
      this.loading = true;
      try {
        const apiResponse = await axios.get(`subdomain/${domain}`);
        this.shop = apiResponse.data.shop;
        this.products=apiResponse.data.products;
        this.published=apiResponse.data.published;
        this.loading=false;
        return true;
      }catch (error){
        console.log(error)
        this.error='Failed to get shop details';
        this.loading=false;
        return false;
      }
    }
  }
})
