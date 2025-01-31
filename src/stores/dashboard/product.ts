import { defineStore } from 'pinia'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import axios from 'axios'
import type { CreateProduct } from '@/requests/create-product'
import type { Specification } from '@/models/specification'

export const useDashboardProductStore = defineStore('dashboardProductStore',{

  state(){
    return{
      products: null as Page<Product> | null,
      loading : false,
      errorMessage : null as string | null,
    }
  },

  actions:{
    async getProducts(search?: string, shopId?: number, page?:number) {
      this.loading = true;
      const query: { [key: string]: string | number } = {};

      if (search) {
        query.search = search;
      }

      if (shopId) {
        query.shop_id = shopId;
      }
      const url = page ? `products/?page=${page}`:'products';
      const apiResponse = query && Object.keys(query).length
        ? await axios.get(url, { params: query })
        : await axios.get(url);

      this.loading = false;

      if (apiResponse.status < 400) {
        if (page){
          if (!this.products){
            this.products = apiResponse.data.result
          }else{
           const formatedResponse:Page<Product> = apiResponse.data.result;
           this.products.total=formatedResponse.total;
           this.products.per_page=formatedResponse.per_page;
           this.products.data = [
             ...this.products.data,
             ...formatedResponse.data
           ]
          }
        }else{
          this.products = apiResponse.data.result;
        }

      }
    },

    async createProduct(product:CreateProduct):Promise<boolean>{
      this.loading=true;
      const query = new FormData();
      query.append('name', product.name);
      query.append('description', product.description);
      query.append('price',String(product.price));
      for (const key in product.specification){
        if (product.specification.hasOwnProperty(key)){
          query.append(`specification[${key}]`,product.specification[key]);
        }
      }
      if (product.images){
        product.images.forEach((image,index)=>{
          query.append(`images[${index}]`,image);
        })
      }
      if (product.videos){
        product.videos.forEach((video,index)=>{
          query.append(`videos[${index}]`,video);
        })
      }
      const apiResponse = await axios.post('/products',query,{
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      });
      this.loading=false
      return apiResponse.status<400

    },

    async deleteProducts (productsIds:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        'product_ids':productsIds
      }
      const apiResponse = await axios.delete('/products',{params:query});
      this.loading=false;

      return apiResponse.status<400;
    },

    async getProductDetails(productId:number):Promise<Product>{
      this.loading=true;
      const apiResponse = await axios.get(`products/get-product/${productId}`);
      this.loading=false;
      if (apiResponse.status<400){
        return apiResponse.data.product;
      }else{
        return Promise.reject();
      }
    },

    async deleteProductMedia (productId:number,medias:number[]):Promise<boolean>{
      this.loading=true;
      const  query = {
        product_id:productId,
        medias:medias
      };
      const apiResponse = await axios.get('/products/delete-media',{params:query});
      this.loading=false;
      return apiResponse.status<400;
    },

    async deleteProductSpecification (productId:number,specifications:number[]):Promise<boolean>{
      this.loading=true;
      const query = {
        product_id: productId,
        specifications:specifications,
      };
      const apiResponse= await axios.get('/products/delete-specification',{params:query});
      this.loading=false;
      return apiResponse.status<400;
    },

    async addProductMedia (productId:number,images?:File[],videos?:File[]):Promise<boolean>{
      this.loading=true;
      if (images || videos){
        const query = new FormData();
        query.append('product_id',String(productId));
        if (images) {
          images.forEach((image,index)=>{
            query.append(`images[${index}]`,image)
          })
        }
        if (videos) {
          videos.forEach((video,index)=>{
            query.append(`videos[${index}]`,video);
          })
        }

        const apiResponse = await axios.post('/products/add-media',query,{
          headers:{
            'Content-Type': 'multipart/form-data',
          }
        });

        this.loading=false;
        return apiResponse.status<400;
      }else {
        this.loading=false;
        return false;
      }
    },

    async addProductSpecification(productId: number, specifications:string[]):Promise<boolean>{
      this.loading=true;
      const query = new FormData();
      query.append('product_id',String(productId));
      for ( const key in specifications){
        if (specifications.hasOwnProperty(key)){
          query.append(`specifications[${key}]`,specifications[key]);
        }
      }
      const apiResponse = await axios.post('/products/add-specification',query, {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      });

      this.loading=false;
      return apiResponse.status<400
    },

    async updateProductSpecification(productId:number, specifications:Specification[]):Promise<boolean>{
      this.loading=true

      const query = {
        product_id:productId,
        specifications:specifications
      }

      const apiResponse = await axios.get('/products/update-specification',{params:query});

      this.loading=false;
      return apiResponse.status<400
    },

    async updateProduct (productId:number, name:string,description:string,price:number):Promise<boolean>{
      this.loading=true

      const query = {
        name:name,
        description:description,
        price:price,
      }

      const apiResponse = await axios.put(`/products/${productId}`,query);

      this.loading=false;
      return apiResponse.status<400;
    }

  }
})
