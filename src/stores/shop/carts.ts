import { defineStore } from 'pinia'
import axios from 'axios'
import type { Promotion } from '@/models/promotion'
import type { CreateOrder } from '@/requests/create-order'
import { useOrderStore } from '@/stores/shop/orders'

export const useCartStore = defineStore('cart',{
  state() {
      return {
        products:null as CartProduct[]|null,
        promotions:null as Promotion[]|null,
        loading:false,
        error:null as string|null,
      }
  },

  actions:{
    getCart():void{
      const cart = localStorage.getItem('cart');
      if (cart){
        this.products=JSON.parse(cart);
      }
    },

    addProductToCart(cartProduct:CartProduct):void{
      this.loading=true;
      if (this.products){
        const cartProducts:CartProduct[]= this.products;
        let cartProductId;
        for (let i = 0; i < cartProducts.length; i++) {
          if(cartProduct.id === cartProducts[i].id){
            cartProductId=i;
            break
          }
        }
        if (cartProductId){
          cartProducts[cartProductId]=cartProduct;
          localStorage.setItem('cart',JSON.stringify(cartProducts));
          this.products=cartProducts;
        }else {
          cartProducts.push(cartProduct);
          localStorage.setItem('cart',JSON.stringify(cartProducts));
          this.products=cartProducts;
        }
      }else{
        const cart :CartProduct[] = [];
        cart.push(cartProduct);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.products=cart;
      }
      this.loading=false;
    },

    async removeProduct(id: number): Promise<boolean> {
      this.loading = true;
      if (this.products != null) {
        const cartProducts: CartProduct[] = this.products;
        let cartProductId;
        for (let i = 0; i < cartProducts.length; i++) {
          if (id === cartProducts[i].id) {
            cartProductId = i;
            break
          }
        }
        if (cartProductId != null) {
          cartProducts.splice(cartProductId, 1);
          localStorage.setItem('cart', JSON.stringify(cartProducts));
          this.products = cartProducts;
          this.promotions = null;
          await this.getCartPromotions();
          this.loading= false;
          return true
        }
        this.loading= false;
        return false
      }
      this.loading=false;
      return false;
    },

    updateProductQuantity(id:number,quantity:number):void{
      this.loading=true;
      if (this.products){
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id){
            this.products[i].quantity=quantity;
            break;
          }
        }
        localStorage.setItem('cart',JSON.stringify(this.products));
      }
      this.loading=false;
    },

    async addPromotionCode(code: string): Promise<void> {
      this.loading=true;
      if (this.products) {
        const productsId: number[] = [];
        for (let i = 0; i < this.products.length; i++) {
          productsId.push(this.products[i].id);
        }
        const query = {
          code: code,
          products: productsId,
        }
        const apiResponse = await axios.get('promotions/verify-code', { params: query });

        if (apiResponse.status >= 400) {
          this.error = "Une erreur s'est produite";
          this.loading=false;
          return Promise.reject();
        } else {
          if (apiResponse.data.promotion && apiResponse.data.products.length!=0) {
            const promotion:Promotion = apiResponse.data.promotion;
            if (this.promotions) {
              const alreadyIn = this.promotions.some(p=>p.id===promotion.id);
              if(alreadyIn) {
                this.error="Le promotion a déja été ajoutée";
                this.loading=false;
                return Promise.reject();
              }else{
                this.promotions.push(promotion);
              }
            } else {
              this.promotions = [promotion];
            }

            this.products.forEach(product => {
              if (apiResponse.data.products.some((pId:number) => pId === product.id)) {
                if (product.promotions) {
                  const promotionExists = product.promotions.some(pId => pId === promotion.id);
                  if (!promotionExists) {
                    product.promotions.push(promotion.id);
                  }
                } else {
                  product.promotions = [apiResponse.data.promotion.id];
                }
              }
            });
            localStorage.setItem('cart', JSON.stringify(this.products));
            this.loading=false;
          } else {
            this.error = "La promotion n'existe plus ou a expiré";
            this.loading=false;
            return Promise.reject();
          }
        }
      }
    },

    removePromotion(code: string): boolean {
      this.loading=true;
      if (this.promotions && this.products) {
        let promotionId: number | undefined;

        for (let i = 0; i < this.promotions.length; i++) {
          if (this.promotions[i].code === code) {
            promotionId = this.promotions[i].id;
            this.promotions.splice(i,1);
            break;
          }
        }

        if (promotionId) {
          for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].promotions) {
              this.products[i].promotions = this.products[i].promotions!.filter((pId: number) => pId !== promotionId);
            }
          }
          localStorage.setItem('cart', JSON.stringify(this.products));
          this.loading= false;
          return true;
        }
        this.loading=false;
        return false;
      }
      this.loading=false;
      return false;
    },

    async getCartPromotions():Promise<void>{
      this.loading=true;
      if (this.products!=null){
        for(const product of this.products){
          if (product.promotions){
            if (this.promotions===null|| this.promotions.length===0){
              this.promotions=[];
              for (const promotionId of product.promotions) {
                try {
                  const promotion = await this.getPromotion(promotionId);
                  this.promotions.push(promotion);
                }catch{
                  this.error ="Une erreur s'est produite"
                }
              }
            }else{
              for (const promotionId of product.promotions) {
                try {
                  const promotion = await this.getPromotion(promotionId);
                  const alreadyIn = this.promotions.some(p=>p.id===promotion.id);
                  if (!alreadyIn) this.promotions.push(promotion);
                }catch{
                  this.error ="Une erreur s'est produite"
                }
              }
            }
          }
        }
      }
      this.loading=false;
    },

    async getPromotion(id:number):Promise<Promotion>{
      this.loading=true;
      const apiResponse = await  axios.get(`promotions/${id}`);
      if (apiResponse.status>=400){
        this.loading=false;
        return Promise.reject()
      }else {
        this.loading=false;
        return apiResponse.data.promotion;
      }
    },

    async placeOrder(order:CreateOrder):Promise<boolean>{
      this.loading=true;
      const orderStore = useOrderStore();
      const  apiResponse = await axios.post('orders',order);
      this.loading=false;
      if (apiResponse.status<400){
        orderStore.addOrder(apiResponse.data.order);
        return true;
      }
      return false
    }
  }
})
