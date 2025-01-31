import { defineStore } from 'pinia'
import type { Page } from '@/models/page'
import type { Category } from '@/models/category'
import { useShopStore } from '@/stores/shop/shops'
import axios from 'axios'
import type { Product } from '@/models/product'

/*
* TODO: Fix load more
* */
export const useCategoryStore= defineStore('category',{
  state() {
      return {
        categories: null as Page<Category>|null,
        page:0,
        loading:false,
        error:null as string|null,
      }
  },

  actions:{
    async getCategory():Promise<void>{
      this.loading=true
      const shopStore = useShopStore();
      if(shopStore.domain!==null){
        let apiResponse;
        if (this.page===0)
        {
          apiResponse = await axios.get(`subdomain/${shopStore.domain}/get-categories`);
        }else {
          apiResponse= await axios.get(`subdomain/${shopStore.domain}/get-categories/?page=${this.page}`);
        }
        if (apiResponse.status>=400){
          this.error='Une erreur est survenue';
        }else{
          if (!this.categories) {
            this.categories = apiResponse.data.categories;
          } else {
            this.categories = {
              ...this.categories,
              ...apiResponse.data.categories
            }
          }
          this.page+=1;
        }
      }else {
        this.error='Une erreur est survenue';
      }
      this.loading=false;
    },

    async getCategoryProduct(id: number,page?:number): Promise<Page<Product>>{
      const shopStore = useShopStore();
      if (shopStore.domain!==null){
        let apiResponse;
        if (page){
          apiResponse = await axios.get(`subdomain/${shopStore.domain}/category/${id}/products`);

        }else {
          apiResponse = await axios.get(`subdomain/${shopStore.domain}/category/${id}/products/?page=${page}`);
        }
        if (apiResponse.status>=400){
          return Promise.reject();
        }else {
          return apiResponse.data.products;
        }
      }
      return Promise.reject();
    }
  }
})
