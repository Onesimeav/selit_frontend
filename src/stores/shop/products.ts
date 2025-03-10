import { defineStore } from 'pinia'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import { useShopStore } from '@/stores/shop/shops'
import axios from 'axios'

export const useProductStore = defineStore('product',{
  state() {
      return {
        product:null as Page<Product>|null,
        page:0,
        loading:false,
        error:null as string|null,
      }
  },

  actions:{

    async getProducts():Promise<void>{
      this.loading=true
      const shopStore = useShopStore();
      if(shopStore.domain!==null){
        let apiResponse
        if (this.page===0){
          apiResponse= await axios.get(`subdomain/${shopStore.domain}/get-products/`);
        }else{
          apiResponse= await axios.get(`subdomain/${shopStore.domain}/get-products/?page=${this.page}`);
        }

        if (apiResponse.status>=400){
          this.error='Une erreur est survenue';
        }else{
          if(!this.product){
            this.product=apiResponse.data.products
          }else{
            this.product={
              ...this.product,
              ...apiResponse.data.products
            }
          }
          this.page+=1;
        }

      }else {
        this.error='Une erreur est survenue';
      }
       this.loading=false;
    },

    async getProduct(id:number):Promise<Product>{
      this.loading=true;
      const apiResponse = await axios.get(`/products/get-product/${id}`);
      this.loading=false;
      if (apiResponse.status>=400){
        return Promise.reject();
      }else{
        return apiResponse.data.product
      }
    },

    async searchProduct(keyword:string,categoryId?:number):Promise<Page<Product>>{
      this.loading=true;
      const shopStore = useShopStore();
      if (shopStore.shop){
        let query;
        if(categoryId){
          query = {
            'keyword':keyword,
            'category_id':categoryId,
            'shop_id':shopStore.shop.id,
          }
        }else {
          query = {
            'keyword':keyword,
            'shop_id':shopStore.shop.id,
          }
        }
        const apiResponse= await axios.get('products/search-product', {params:query});

        if(apiResponse.status>=400){
          return Promise.reject();
        }
        return apiResponse.data.result
      }
      this.loading=false
      this.error='Une erreur est survenue lors du chargement de la boutique';
      return  Promise.reject();

    }


  }
})
