<script setup lang="ts">

  import Pusher from 'pusher-js'
  import { onMounted, ref } from 'vue'
  import type { Order, OrderProduct } from '@/models/order'
  import { useOrderStore } from '@/stores/shop/orders'
  import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
  import OrderSummaryCard from '@/components/shop/OrderSummaryCard.vue'
  import CancelOrderButton from '@/components/shop/CancelOrderButton.vue'
  import PayOrderButton from '@/components/shop/PayOrderButton.vue'

  const props = defineProps<{
    orderId:number;
  }>();
  const orderStore = useOrderStore();
  const order = ref<Order>();
  const orderStatus = ref<string>();
  const step = ref<number>(1);
  const orderProducts = ref<OrderProduct[]>();
  const  orderPrice = ref<number>(0);


  const getOrderDetails = async () => {
    const response = await orderStore.getOrder([props.orderId]);
    order.value = response[0];
    orderStatus.value=order.value.status;
    orderProducts.value = order.value.orderProducts;
    getOrderPrice();
    setOrderStep();
  }

  const getOrderPrice = ()=>{
    if (order.value && order.value.orderProducts){
      for (let i = 0; i < order.value.orderProducts.length; i++) {
        orderPrice.value+=(order.value.orderProducts[i].price_promotion_applied*order.value.orderProducts[i].product_quantity);
      }
    }
  }

  const setOrderStep=()=>{
    switch (orderStatus.value){
      case 'Approved':
          step.value=2;
          break;
      case 'Delivery in progress':
          step.value=3;
          break;
      case 'Delivered':
          step.value=4;
          break;
      case 'Finished':
        step.value=5;
        break;
      case 'Canceled':
        step.value=6;
        break;
      default:
        step.value=1;
    }
  }

  const cancelOrder =  async (userSecret:number)=>{
    if (userSecret && order.value){
      if (await orderStore.cancelOrder(order.value.order_reference,userSecret)){
        step.value=6;
      }
    }
  }

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY,{cluster:import.meta.env.VITE_PUSHER_CLUSTER});
  const channel = pusher.subscribe(`order-status-${props.orderId}`);
  channel.bind('order-status-change',function(data:{orderId:number,orderStatus:string}){
    orderStatus.value=data.orderStatus;
    setOrderStep();
  })

  onMounted(()=>{
    getOrderDetails();
  })
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
  <div v-if="order">
    <p v-if="step===1" class="font-rubik font-semibold text-heading-2 mx-4">En attente de validation</p>
    <p v-if="step===2" class="font-rubik font-semibold text-heading-2 mx-4">Commande approuvée</p>
    <p v-if="step===3" class="font-rubik font-semibold text-heading-2 mx-4">Livraison en cours</p>
    <p v-if="step===4" class="font-rubik font-semibold text-heading-2 mx-4">Commande livrée</p>
    <p v-if="step===5" class="font-rubik font-semibold text-heading-2 mx-4">Terminer</p>
    <p v-if="step===6" class="font-rubik font-semibold text-heading-2 mx-4">Commande annuluée</p>

    <div class="grid grid-cols-5 mx-1.5 mt-5  mb-3 items-center">
      <div class="col-span-1 w-full border-none h-2 rounded-lg bg-green-800" :class="step===6?'bg-red-800':''"></div>
      <div class="col-span-1 w-full border-none h-2 rounded-lg" :class="{'bg-red-800':step===6, 'bg-green-800':step>=2, 'bg-appGray':step<2}"></div>
      <div class="col-span-1 w-full border-none h-2 rounded-lg " :class="{'bg-red-800':step===6, 'bg-green-800':step>=3, 'bg-appGray':step<3}"></div>
      <div class="col-span-1 w-full border-none h-2 rounded-lg" :class="{'bg-red-800':step===6, 'bg-green-800':step>=4, 'bg-appGray':step<4}"></div>
      <div class="col-span-1 w-full border-none h-2 rounded-lg" :class="{'bg-red-800':step===6, 'bg-green-800':step>=5, 'bg-appGray':step<5}"></div>
    </div>

    <p class="font-rubik font-semibold text-heading-3 mx-4">Détails de la commande</p>
    <p class="font-rubik font-regular text-normal-text text-appGray mx-4">Numéro de référence</p>
    <p class="font-rubik font-regular text-normal-text mx-4 mb-2">{{order.order_reference}}</p>
    <p class="font-rubik font-regular text-normal-text text-appGray mx-4">Addresse</p>
    <p class="font-rubik font-regular text-normal-text mx-4">{{order.location}}</p>

    <p class="font-rubik font-semibold text-heading-3 mx-4 mt-4 ">Résumé de la commande</p>
    <div v-if=" orderProducts" >
      <div v-for="(orderProduct, index) in orderProducts" :key="index">
          <order-summary-card :order-product="orderProduct"/>
      </div>
    </div>

    <div class="fixed z-10  bottom-0 w-full shadow-top">
      <div class="mx-4 mt-2 mb-20">
        <div class="flex justify-between w-full">
          <p class="font-rubik font-semibold text-heading-3">Total:</p>
          <p class="font-rubik font-semibold text-heading-3">{{orderPrice}} XOF</p>
        </div>
      </div>
    </div>
    <cancel-order-button :order-step="step" @cancel-order="userCode => cancelOrder(userCode)"/>
    <pay-order-button :order-step="step" :order-price="orderPrice" :order-reference="order.order_reference" @order-payed="() =>{}"/>
  </div>
</template>

<style scoped>
.shadow-top {
  box-shadow: 0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
}

</style>
