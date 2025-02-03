import { defineStore } from 'pinia'
import type { Page } from '@/models/page'
import type { Category } from '@/models/category'
import axios from 'axios'
import type { Product } from '@/models/product'
import type { CreateCategory } from '@/requests/create-catgory'

export const useDashboardCategoryStore = defineStore('dashboardCategory',{
  state() {
      return{
        categories: null as Page<Category>| null,
        loading:false,
        errorMessage:null as string | null,
      }
  },

  actions:{
    async getCategories(shopId?:number,search?:string, page? : number):Promise<void>{
      this.loading=true;
      const query : {[key:string]:string|number} = {}

      if (shopId) query.shop_id=shopId;
      if (search) query.search=search;

      const url:string = page?`category/?page=${page}`:'category';
      const apiResponse = query && Object.keys(query).length
        ? await axios.get(url,{params:query})
        : await axios.get(url);

      this.loading=false
      if(apiResponse.status<400){
        if (page){
          if(!this.categories){
            this.categories = apiResponse.data.result;
          }else {
            const formatedResponse:Page<Product> = apiResponse.data.result;
            this.categories.total=formatedResponse.total;
            this.categories.per_page = formatedResponse.per_page;
            this.categories.data = [
              ...this.categories.data,
              ...formatedResponse.data
            ]
          }
        }else{
          this.categories = apiResponse.data.result;
        }
      }
    },

    async createCategory(category:CreateCategory):Promise<number>{
      this.loading=true;
      const apiResponse = await axios.post('category',category);
      this.loading=false;
      if (apiResponse.status<400){
        return apiResponse.data.category_id;
      }else{
        return Promise.reject()
      }
    },

    async updateCategory(categoryId:number,name:string):Promise<boolean>{
      this.loading=true
      const query = {
        name:name
      }
      const apiResponse = await axios.put(`category/${categoryId}`,query);
      this.loading=false;
      return  apiResponse.status<400;
    },

    async deleteCategory (categoryId:number):Promise<boolean>{
      this.loading=true;
      const apiResponse =await axios.delete(`category/${categoryId}`);
      this.loading=false;
      return apiResponse.status<400;
    },

    async getCategory(categoryId:number):Promise<Category>{
      this.loading=true;
      const query = {
        category_id:categoryId
      }
      const apiResponse = await axios.get('category',{params:query});
      this.loading=false;
      if (apiResponse.status<400){
        return apiResponse.data.result;
      }else{
        return Promise.reject();
      }

    },

    async getCategoryProducts (category_id:number, page?:number):Promise<Page<Product>>{
      this.loading=true;
      const url = page ? `category/get-products/${category_id}/?page=${page}`:`category/get-products/${category_id}`;
      const apiResponse = await axios.get(url);
      this.loading=false;
      if (apiResponse.status<400){
        return apiResponse.data.products;
      }else{
        return Promise.reject();
      }

    },

    async addProductToCategory (categoryId:number,products:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        category_id:categoryId,
        products:products
      }
      const apiResponse = await axios.post('category/add-products',query);
      this.loading=false
      return apiResponse.status<400;
    },

    async removeProductFromCategory (categoryId:number,products:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        category_id:categoryId,
        products:products
      }
      const apiResponse = await axios.post('category/remove-products',query);
      this.loading=false;
      return apiResponse.status<400;
    }

  }
})
