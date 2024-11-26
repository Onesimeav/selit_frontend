<script setup lang="ts">
  import type { Order } from '@/models/order'
  import { useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'

  const router = useRouter();
  const props = defineProps<{
    order:Order;
  }>()
  const orderPrice = ref<number>(0)
  const getOrderPrice = ()=>{
    if (props.order && props.order.orderProducts){
      for (let i = 0; i < props.order.orderProducts.length; i++) {
        orderPrice.value+=(props.order.orderProducts[i].price_promotion_applied*props.order.orderProducts[i].product_quantity);
      }
    }
  }
  const redirectToOrderDetails= ()=>{
    router.push({
      name:'order-details',
      params:{
        id:props.order.id,
      }
    });
  }
  onMounted(getOrderPrice);
</script>

<template>
  <div @click="redirectToOrderDetails" class="border-0 rounded-lg shadow-md shadow-gray-300">
    <p class="font-rubik font-semibold text-black text-heading-3 m-1">{{order.order_reference}}</p>
    <hr class="border-t-1 border-appGray my-1">
    <div class=" grid grid-cols-8 justify-between m-1">
      <div class="col-span-4">
        <p class="font-rubik font-normal text-gray-500 text-heading-3 m-1">Quantité: <span class="text-black">{{order.orderProducts?.length}}</span></p>
      </div>
      <div class="col-span-4">
        <p class="font-rubik font-normal text-gray-500 text-heading-3 m-1">Frais total: <span class="text-black">{{orderPrice}}</span></p>
      </div>
    </div>
    <div class=" grid grid-cols-8 justify-between m-1">
      <div class="col-span-4">
        <p class="font-rubik font-normal text-gray-500 text-heading-3 m-1">Status:</p>
      </div>
      <div class="col-span-4">
        <p v-if="order.status==='Pending'|| order.status==='Approved'|| order.status==='Delivery in progress'" class="font-rubik font-normal text-yellow-400 text-heading-3 m-1"><span v-if="order.status ==='Pending'">En cours</span><span v-if="order.status ==='Approved'">Approuvée</span><span v-if="order.status ==='Delivery in progress'">Livraison en cours</span></p>
        <p v-if="order.status==='Delivered'|| order.status==='Finished'" class="font-rubik font-normal text-green-500 text-heading-3 m-1"><span v-if="order.status ==='Finished'">Terminée</span><span v-if="order.status ==='Delivered'">Livrée</span></p>
        <p v-if="order.status==='Canceled'" class="font-rubik font-normal text-red-600 text-heading-3 m-1">Annulée</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
