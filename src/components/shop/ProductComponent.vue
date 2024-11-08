<script setup lang="ts">

import { useProductStore } from '@/stores/shop/products'
import { onMounted, ref } from 'vue'
import ProductMediaCarrousel from '@/components/shop/ProductMediaCarrousel.vue'
import type { Product } from '@/models/product'
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import CounterComponent from '@/components/shop/CounterComponent.vue'
import DetailsComponent from '@/components/shop/DetailsComponent.vue'
import AddToCartButton from '@/components/shop/AddToCartButton.vue'
import { useCartStore } from '@/stores/shop/carts'
import { initFlowbite } from 'flowbite'

const productStore= useProductStore();
const  props= defineProps<{
   id:number,
 }>()
const product = ref<Product>()
const productPrice = ref<number>();
const promotionProductPrice = ref<number>()
const getProduct = async ()=>{
  product.value=await productStore.getProduct(props.id);
  if (product.value){
    productPrice.value=product.value.price;
    if (product.value.auto_apply_promotions){
      let promotionValue = 0;
      for (let i = 0; i < product.value.auto_apply_promotions.length; i++) {
        promotionValue +=product.value.auto_apply_promotions[i].value;
      }
      if (promotionValue!=0){
        promotionProductPrice.value=(productPrice.value*(100 -promotionValue))/100
      }
    }
  }
} ;
const productQuantity = ref<number>(1);
const updateValue=(value:number)=>{
  productQuantity.value=value;
}
const cartStore = useCartStore();
const addProductToCart = ()=>{
  if(product.value){
    const cartProduct: CartProduct = {
      id:product.value.id,
      quantity:productQuantity.value
    }
    cartStore.addProductToCart(cartProduct);
  }else{
    console.log('Product still loading');
  }

}
onMounted(()=>{
  getProduct();
  initFlowbite();
})
</script>

<template>
  <div class="relative">
    <div class="absolute z-50 top-1 start-2">
      <PreviousPageButton/>
    </div>
    <div v-if="product">
      <ProductMediaCarrousel :media="product.medias" class="relative"/>
    </div>
  </div>
  <div class="flex items-center justify-between mx-2.5 mt-3">
    <p class=" text-black font-rubik font-bold text-heading-1">{{product?.name}}</p>
    <p class=" font-rubik font-medium text-heading-2">
      <span v-if="promotionProductPrice===0" class="text-black">{{productPrice}}</span>
      <span v-if="promotionProductPrice!=0" class="text-appGray line-through mr-0.5">{{productPrice}}</span>
      <span v-if="promotionProductPrice!=0" class="text-black">{{promotionProductPrice}}</span> XOF
    </p>
  </div>
  <CounterComponent @input-value="value => updateValue(value)"/>
  <p class="text-black font-rubik font-semibold text-normal-text mx-2.5 my-2.5">Description</p>
  <p class="text-black font-sora font-normal text-normal-text mx-2.5">{{product?.description}}</p>
  <div v-if="product">
    <DetailsComponent :specifications="product.specifications"/>
  </div>
  <AddToCartButton @add-to-cart="addProductToCart"/>
</template>

<style scoped>

</style>
