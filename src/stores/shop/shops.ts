import { defineStore } from 'pinia'
import type { Shop } from '@/models/shop'
import axios from 'axios'

export const useShopStore = defineStore('shop',{
  state() {
      return{
        shop:null as Shop|null,
        domain:null as string|null,
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
        this.published=apiResponse.data.published;
        this.domain=domain;
        this.loading=false;
        return true;
      }catch (error){
        console.log(error);
        this.error='Une erreur est survenue';
        this.loading=false;
        return false;
      }
    },
  }
})
