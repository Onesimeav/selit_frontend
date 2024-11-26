<script setup lang="ts">
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { useOrderStore } from '@/stores/shop/orders'
import { onMounted, ref, watch } from 'vue'
import type { Order } from '@/models/order'
import OrderTabComponent from '@/components/shop/OrderTabComponent.vue'
import { initFlowbite } from 'flowbite'

const orderStore = useOrderStore();
const orders = ref<Order[]>([])
const ordersInProcess = ref<Order[]>([]);
const ordersFinished = ref<Order[]>([]);
const ordersCancelled = ref<Order[]>([])
const getOrders = async () => {
  const ordersId = orderStore.ordersId;
  if (ordersId && ordersId.length > 0) {
    orders.value = await orderStore.getOrder(ordersId);
    ordersInProcess.value = [];
    ordersFinished.value=[];
    ordersCancelled.value=[];
    orders.value.forEach(order=>{
      if (order.status=="Pending" || order.status=="Approved" || order.status=="Delivery in progress"){
        ordersInProcess.value.push(order);
      }else {
        if (order.status=="Delivered" || order.status=="Finished"){
          ordersFinished.value.push(order);
        }else{
          ordersCancelled.value.push(order);
        }
      }
    })
  }
}

watch(()=>orderStore.ordersId, (newOrdersId)=>{
  if (newOrdersId){
    getOrders();
  }
});
onMounted(()=>{
  initFlowbite();
  getOrders();
});
</script>

<template>
  <div class="grid grid-cols-8 py-4 items-center">
    <div class="col-span-1 flex flex-col items-center">
      <PreviousPageButton/>
    </div>
    <div class="col-span-7 flex flex-col items-center">
      <p class="text-black font-rubik font-bold text-heading-3 ">Mes commandes</p>
    </div>
  </div>
  <order-tab-component v-if="orders.length>0" :orders-in-processing="ordersInProcess" :orders-finished="ordersFinished" :orders-cancelled="ordersCancelled"/>
</template>

<style scoped>

</style>
