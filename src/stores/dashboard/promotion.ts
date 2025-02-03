import { defineStore } from 'pinia'
import type { Promotion } from '@/models/promotion'
import type { Page } from '@/models/page'
import axios from 'axios'
import type { CreatePromotion } from '@/requests/create-promotion'
import type { Product } from '@/models/product'

export const useDashboardPromotionStore = defineStore('dashboardPromotion',{
  state() {
      return {
        promotions: null as Page<Promotion> | null,
        loading : false,
        errorMessage: null as string| null,
      }
  },

  actions:{
    async getPromotions (search?:string,shopId?:number,page?:number): Promise<void>{
      this.loading = true;

      const query :{[key:string]:string|number} = {}
      if (search) query.search=search;
      if (shopId) query.shop_id=shopId;

      const url = page?`promotions/?page=${page}`:'promotions';

      const apiResponse = query && Object.keys(query).length
        ? await axios.get(url,{params:query})
        : await  axios.get(url);

      this.loading = false;

      if (apiResponse.status<400){
        if (page){
          if (!this.promotions){
            this.promotions = apiResponse.data.result;
          }else {
            const formatedResponse : Page<Promotion> = apiResponse.data.result;
            this.promotions.total = formatedResponse.total;
            this.promotions.per_page = formatedResponse.per_page;
            this.promotions.data = [
              ...this.promotions.data,
              ...formatedResponse.data,
            ]
          }
        }else {
          this.promotions = apiResponse.data.result;
        }
      }
    },

    async getPromotion (promotionId:number):Promise<Promotion>{
      this.loading = true;

      const apiResponse = await axios.get(`promotions/${promotionId}`);

      this.loading = false;

      if (apiResponse.status<400){
        return apiResponse.data.promotion
      }else {
        return  Promise.reject();
      }
    },

    async createPromotion (promotion:CreatePromotion):Promise<number>{
      this.loading = true;
      const apiResponse = await  axios.post('promotions',promotion);
      this.loading = false;
      if (apiResponse.status<400){
        return apiResponse.data.promotion_id
      }else {
        return  Promise.reject();
      }
    },

    async updatePromotion (promotionId:number,promotion:CreatePromotion):Promise<boolean>{
      this.loading =true;
      const apiResponse = await axios.put(`promotions/${promotionId}`,promotion);
      this.loading = false;
      return apiResponse.status<400;
    },

    async deletePromotion (promotionId:number):Promise<boolean>{
      this.loading = true;
      const apiResponse = await  axios.delete(`promotions/${promotionId}`);
      this.loading = false;
      return  apiResponse.status<400;
    },

    async getPromotionProducts (promotionId:number,page?:number):Promise<Page<Product>>{
      this.loading = true;
      const url = page?`promotions/get-products/${promotionId}/?page=${page}`:`promotions/get-products/${promotionId}`
      const apiResponse = await  axios.get(url);
      this.loading = false;
      if (apiResponse.status<400){
        return apiResponse.data.products
      }else{
        return Promise.reject()
      }
    },


    async addProductToPromotion (promotionId:number,products:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        promotion_id:promotionId,
        products:products
      }
      const apiResponse = await axios.post('promotions/add-products',query);
      this.loading = false;
      return apiResponse.status<400;
    },

    async removeProductFromPromotion (promotionId:number,products:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        promotion_id : promotionId,
        products:products
      }
      const apiResponse = await  axios.post('promotions/remove-products',query);
      this.loading = false;
      return apiResponse.status<400;
    }
  }
})
