import { defineStore } from 'pinia'
import type { Shop } from '@/models/shop'
import axios from 'axios'
import type { CreateShop } from '@/requests/create-shop'

export const useDashboardShopStore = defineStore('dashboardShop',{
  state() {
      return{
        shops: null as Shop[] | null,
        loading:false,
        errorMessage:null as string | null,
      }
  },

  actions:{
    async getUserShops(search?:string,published?:boolean):Promise<void>{
      this.loading=true;
      const query : {[key:string]:string|boolean}={}
      if (search) query.search=search
      if (published !== undefined) query.published = published;
      const apiResponse = await axios.post('shops/get-shops',query);
      this.loading=false;
      if(apiResponse.status<400){
        this.shops = apiResponse.data.shop;
      }
    },

    async getShop(subdomain:string):Promise<Shop>{
      this.loading= true;
      const apiResponse = await axios.get(`subdomain/${subdomain}`);
      this.loading=false;
      return apiResponse.data.shop;
    },

    async createShop(shop:CreateShop):Promise<boolean>{
      this.loading=true;

      const query = new FormData();
      query.append('name',shop.name);
      query.append('description',shop.description);
      query.append('logo',shop.logo);
      query.append('banner',shop.banner);
      query.append('productType','Physic');
      query.append('subdomain',shop.subdomain);

      const apiResponse = await axios.post('shops',query);

      this.loading=false;

      return apiResponse.status<400
    },

    async publishShop(shopId:number):Promise<boolean>{
      this.loading=true;
      const apiResponse= await axios.get(`shops/publish-shop/${shopId}`);
      this.loading=false;
      return apiResponse.status<400;
    }

  }
})
