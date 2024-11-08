<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
  import { useCartStore } from '@/stores/shop/carts'

const cartStore = useCartStore();
const promotionCode = ref<string[]>([]);
const emit = defineEmits<{
  (event:'removePromotion'):void;
}>()
const getPromotionsCodes = () => {
  if (!cartStore.promotions) return;

  promotionCode.value = cartStore.promotions
    .filter(promotion => promotion.code)
    .map(promotion => promotion.code!);
};

const removePromotion = (code:string,index:number)=>{
  const promotionCodeElement = document.getElementById(index.toString())
  if (cartStore.removePromotion(code)&& promotionCodeElement){
    promotionCodeElement.classList.add('hidden');
  }
  emit('removePromotion');
}


onMounted(getPromotionsCodes);

watch(() => cartStore.promotions, (newPromotions) => {
  if (newPromotions && newPromotions.length!=0){
    promotionCode.value=[];
    newPromotions.forEach(promotion=>{
      if (promotion.code) promotionCode.value.push(promotion.code)
    })
  }else {
    promotionCode.value=[];
  }
},{deep:true})
</script>

<template>
  <div v-if="promotionCode.length>0">
    <div v-for="(code,index) in promotionCode" :key="index" :id="index.toString()" class=" flex items-center justify-center py-2">
      <div class="w-10/12 border-none shadow-md shadow-gray-100 rounded-lg">
        <div class="grid grid-cols-5">
          <div class="col-span-4">
            <p class="font-rubik font-normal text-heading-3 my-4 ml-2.5">{{code}}</p>
          </div>
          <div class="col-span-1">
            <button type="button" @click="removePromotion(code,index)" class="text-white h-full bg-appBlack hover:bg-black  focus:outline-none rounded-lg  px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
