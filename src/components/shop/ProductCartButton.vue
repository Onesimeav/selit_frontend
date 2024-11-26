<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCartStore } from '@/stores/shop/carts'
import { useRouter } from 'vue-router'

  const cartLength = ref<number>(0);
  const cartStore = useCartStore();
  const getCartLength = ()=>{
    if(cartStore.products){
      cartLength.value= cartStore.products.length;
    }
  }
  const route = useRouter();
  const redirectToCartPage=()=>{

   route.push({ name:'cart'});
  }
  watch(() => cartStore.products, (newVal) => {
    if(newVal!=null)
      cartLength.value = newVal.length;
    },
    { deep: true }
  );

onMounted(getCartLength);
</script>

<template>
  <div v-if="cartLength!=0" class="fixed w-full z-40 bottom-5 flex justify-center ">
    <button type="button" @click="redirectToCartPage" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md bg-appBlack hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Voir le panier ({{cartLength}})
    </button>
  </div>
</template>

<style scoped>

</style>
