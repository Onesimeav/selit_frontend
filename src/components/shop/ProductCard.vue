<script setup lang="ts">
  import type { Product } from '@/models/product'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/shop/carts'

  const route = useRouter()
  const props = defineProps<{product:Product}>();
  const productImage= ref<string|null>(null);
  const productPrice= ref<number>();
  if (props.product){
    for (const product of props.product.medias){
      if(product.type==='image'){
        productImage.value = product.url;
        break;
      }
    }
    productPrice.value=props.product.price;
    if (props.product.auto_apply_promotions){
      let promotionValue = 0;
      for (let i = 0; i < props.product.auto_apply_promotions.length; i++) {
        promotionValue+=props.product.auto_apply_promotions[i].value
      }
      if (promotionValue!=0){
        productPrice.value=(productPrice.value*(100-promotionValue))/100
      }
    }
  }
  const cartStore = useCartStore();
  const addProductToCart = ()=>{
    if(props.product){
      const cartProduct: CartProduct = {
        id:props.product.id,
        quantity:1,
      }
      cartStore.addProductToCart(cartProduct);
    }else{
      console.log('Product still loading');
    }
  }
  const redirectToProductPage=()=>{
    route.push({
      name:'product-details',
      params:{
        id:props.product.id,
      }
    })
  }
</script>

<template>
  <div class="relative my-1.5 mx-0.5 w-full bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div class="absolute top-2 right-2">
      <button @click="addProductToCart" type="button" class="border shadow text-white bg-white hover:bg-white/50 focus:ring-gray-800 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center">
        <svg class="w-5 h-5 text-appBlack dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 12h14m-7 7V5"/>
        </svg>
        <span class="sr-only">Add product</span>
      </button>
    </div>
    <div class="p-1.5 flex justify-center">
      <a @click="redirectToProductPage" >
        <img class="rounded-md h-48" v-if="productImage" :src="productImage" alt="product image" />
      </a>
    </div>
    <div class="px-5 pb-5">
      <a @click="redirectToProductPage">
        <h5 class="font-rubik font-semibold text-heading-3 tracking-tight text-gray-900 truncate-ellipsis dark:text-white">{{product.name}}</h5>
      </a>
      <div class="flex items-center justify-between">
        <span class="font-rubik font-medium text-normal-text text-gray-900 dark:text-white">XOF{{productPrice}}</span>
      </div>
    </div>
  </div>



</template>

<style scoped>
.truncate-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
