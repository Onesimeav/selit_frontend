<script setup lang="ts">
import { addKkiapayListener, openKkiapayWidget, removeKkiapayListener } from 'kkiapay'
import { onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/shop/orders'

  const orderStore = useOrderStore();
  const props = defineProps<{
    orderReference:string;
    orderStep:number;
    orderPrice:number;
  }>();
  const emit = defineEmits<{
    (event:'orderPayed'):void
  }>()

  const openPaymentWidget = () => {
    openKkiapayWidget({
      amount:props.orderPrice,
      api_key:import.meta.env.VITE_KKIAPAY_API_KEY,
      sandbox:true,
    })
  }

const verifyOrder = async (response) =>{
  if (await orderStore.verifyOrderPayment(props.orderReference,response.transactionId)){
    emit('orderPayed');
  }
}

onMounted(()=>{
  addKkiapayListener('success', verifyOrder)
});

onUnmounted(()=>{
  removeKkiapayListener('success',verifyOrder)
})

</script>

<template>
  <div v-if="props.orderStep===4" class="flex fixed w-full bottom-0  z-20 justify-center items-center mt-4">
    <button type="button" @click="openPaymentWidget" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md bg-appBlack hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Payer
    </button>
  </div>
</template>

<style scoped>

</style>
