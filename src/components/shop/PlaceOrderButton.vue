<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/shop/carts'

const disable = ref(true);
const cartStore = useCartStore();
const emit = defineEmits<{
    (event:'placeOrder'):void;
  }>()
watch(()=>cartStore.loading,(newLoading)=>{
  disable.value = newLoading;
})
</script>

<template>
  <div class="flex justify-center items-center my-4">
    <button type="button" @click="emit('placeOrder')" :disabled="disable" :class="disable?'bg-gray-500':'bg-appBlack'" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md  hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Commander
    </button>
  </div>
</template>

<style scoped>

</style>
