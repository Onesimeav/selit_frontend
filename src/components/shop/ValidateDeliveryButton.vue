<script setup lang="ts">
  import { ref } from 'vue'
  import { useOrderStore } from '@/stores/shop/orders'

  const props = defineProps<{
    order_reference:string,
  }>();
  const delivered = ref(false);
  const orderStore = useOrderStore();
  const deliverOrder = async ()=>{
    if (await orderStore.setOrderAsDelivered(props.order_reference)){
      delivered.value=true;
    }
  }
</script>

<template>
  <div class="fixed w-full z-40 bottom-5 flex justify-center ">
    <button type="button" @click="deliverOrder" :disabled="delivered" :class="delivered?'bg-gray-500':'bg-appBlack'" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md bg-appBlack hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
     Valider livraison
    </button>
  </div>
</template>

<style scoped>

</style>
