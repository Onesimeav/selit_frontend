<script setup lang="ts">

  import type { Product } from '@/models/product'
  import { onMounted, ref } from 'vue'
  import CounterComponent from '@/components/shop/CounterComponent.vue'
  import { useCartStore } from '@/stores/shop/carts'
  import type { Promotion } from '@/models/promotion'

  const props = defineProps<{
    product:Product & { quantity: number, promotions?:number[] };
  }>();
  const emit = defineEmits<{
    (event:'productPrice',value:number):number;
  }>()
  const promotionValue = ref<number>(0);
  const defaultProductPrice= ref(props.product.price*props.product.quantity);
  const productPrice= ref(props.product.price);
  const cartStore = useCartStore();
  const productImage= ref<string|null>(null);
  if (props.product){
    for (const product of props.product.medias){
      if(product.type==='image'){
        productImage.value = product.url;
        break;
      }
    }
  }

  const getPromotionValue =async () => {
    let productPromotions: Promotion[] = [];

    if (props.product.auto_apply_promotions) {
      productPromotions = props.product.auto_apply_promotions;
    }
    if (props.product.promotions) {
      for (let i = 0; i < props.product.promotions.length; i++) {
        productPromotions.push(await cartStore.getPromotion(props.product.promotions[i]));
      }
    }
    if (productPromotions.length>0){
      for (let i = 0; i < productPromotions.length; i++) {
        promotionValue.value+=productPromotions[i].value;
      }
      productPrice.value=((productPrice.value*(100-promotionValue.value))/100)*props.product.quantity;
    }
    emit('productPrice',productPrice.value)
  };
  const updateProductQuantity = (quantity:number)=>{
    cartStore.updateProductQuantity(props.product.id,quantity);
    const actualProductPrice = productPrice.value;
    if (promotionValue.value!=0){
      productPrice.value=((props.product.price*(100-promotionValue.value))/100)*quantity;
    }else {
      defaultProductPrice.value=props.product.price*quantity;
      productPrice.value=defaultProductPrice.value;
    }
    emit('productPrice',(productPrice.value-actualProductPrice));
  }
  const removeFromCart=async () => {
    const productCardElement = document.getElementById(props.product.id.toString());
    if (await cartStore.removeProduct(props.product.id) && productCardElement) {
      productCardElement.classList.add('hidden');
    }
    emit('productPrice', -(productPrice.value));
  }

  onMounted(getPromotionValue);
</script>

<template>
  <div :id="props.product.id.toString()" ref="product-card" class="grid grid-cols-8 mx-2 py-2 items-center" >
    <div class="col-span-2" v-if="productImage">
      <img :src="productImage" class="rounded-lg" alt="..."/>
    </div>
    <div class="col-span-6">
      <div class="grid grid-cols-5 justify-between">
        <div class="col-span-4 justify-around">
          <p class="text-appGray font-rubik font-normal text-normal-text ml-2.5">{{props.product.name}}</p>
          <p class="font-rubik font-bold ml-2.5">
            <span v-if="promotionValue===0" class="text-black">{{defaultProductPrice}} XOF</span>
            <span v-if="promotionValue>0"  class="text-appGray line-through mr-0.5">{{defaultProductPrice}}</span>
            <span v-if="promotionValue>0" class="text-black">{{productPrice}}</span>
          </p>
          <CounterComponent @input-value="value => updateProductQuantity(value)" :count="props.product.quantity"/>
        </div>
        <div class="col-span-1">
          <button type="button" @click="removeFromCart">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
