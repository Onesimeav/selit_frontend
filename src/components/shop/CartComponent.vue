<script setup lang="ts">

import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { useCartStore } from '@/stores/shop/carts'
import { onMounted, ref, watch } from 'vue'
import type { Product } from '@/models/product'
import { useProductStore } from '@/stores/shop/products'
import CartProductCard from '@/components/shop/CartProductCard.vue'
import PlaceOrderButton from '@/components/shop/PlaceOrderButton.vue'
import PromotionComponent from '@/components/shop/PromotionComponent.vue'

const cartStore = useCartStore();
const productStore = useProductStore();
const products = ref<(Product & { quantity: number, promotions?:number[] })[]>([]);
const cartTotal = ref(0);
const getProducts = async () => {
  if (cartStore.products != null) {
    const cartProducts: CartProduct[] = cartStore.products;
    for (let i = 0; i < cartProducts.length; i++) {
      const product = await productStore.getProduct(cartProducts[i].id);
      if (cartProducts[i].promotions){
        products.value[i] = {
          ...product,
          quantity: cartProducts[i].quantity,
          promotions: cartProducts[i].promotions
        };
      }else{
        products.value[i] = {
          ...product,
          quantity: cartProducts[i].quantity,
        };
      }

    }
  }
};


const getCartTotal = (productPrice:number)=>{
  cartTotal.value+=productPrice;
}
const updateCart = async ()=>{
  products.value= [];
  cartTotal.value=0;
  await getProducts();
}
watch(()=>cartStore.products,async () => {
    await updateCart();
  },
)

onMounted(getProducts);
</script>

<template>
<div class="grid grid-cols-8 py-4 items-center">
  <div class="col-span-1 flex flex-col items-center">
    <PreviousPageButton/>
  </div>
  <div class="col-span-7 flex flex-col items-center">
    <p class="text-black font-rubik font-bold text-heading-3 ">Mon panier</p>
  </div>
</div>
  <div v-if="products.length>0" >
    <cart-product-card v-for="(product,index) in products" :key="index" :product="product" @product-price="value => getCartTotal(value)"/>
  </div>
  <promotion-component @update-cart="async ()=>{await updateCart()}"/>
  <p class="font-rubik text-heading-2 font-bold flex justify-between items-center mx-2.5 my-1">
    <span class="text-appGray">Total:</span>
    <span class="text-black">{{cartTotal}}</span>
  </p>
  <PlaceOrderButton :disable="canPlaceOrder"/>

</template>

<style scoped>

</style>
