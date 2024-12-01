<script setup lang="ts">
import { onMounted, ref } from 'vue'
    import type { OrderDelivery } from '@/models/orderDelivery'
    import { useOrderStore } from '@/stores/shop/orders'
import CustomerCard from '@/components/shop/CustomerCard.vue'
import ValidateDeliveryButton from '@/components/shop/ValidateDeliveryButton.vue'


   const props = defineProps<{
     orderReference:string,
   }>()
   const orderDeliveryInfos = ref<OrderDelivery>();
   const orderStore = useOrderStore();
   const mapLink=ref<string>();

   const getOrderDeliveryInfo = async () => {
     orderDeliveryInfos.value= await orderStore.getOrderDeliveryInfos(props.orderReference);
     getGoogleMapsLink();
   }

   const getGoogleMapsLink = ()=>{
     if (orderDeliveryInfos.value){
       mapLink.value="https://www.google.com/maps/search/?api=1&query="+orderDeliveryInfos.value.location_latitude+","+orderDeliveryInfos.value.location_longitude
     }
   }

   onMounted(getOrderDeliveryInfo);

</script>

<template>
  <div v-if="orderDeliveryInfos">
    <h1 class="font-sora font-extrabold text-5xl mt-4 mx-1">Hello <span class=" font-bold text-heading-1">{{orderDeliveryInfos.deliveryman_name}}</span></h1>
    <p class=" font-rubik font-normal my-6 mx-1">Vous devez livrer la commande: <span class="font-semibold ">{{orderDeliveryInfos.order_reference}}</span> </p>

    <p class="font-rubik font-semibold text-heading-3 mx-4">Détails de la commande</p>
    <customer-card :name="orderDeliveryInfos.name" :surname="orderDeliveryInfos.surname" :number="orderDeliveryInfos.number" :email="orderDeliveryInfos.email"/>
    <p class="font-rubik font-regular text-heading-3 text-appGray mx-4">Addresse</p>
    <p class="font-rubik font-regular text-heading-3 mx-4">{{orderDeliveryInfos.address}}</p>

    <p class="font-rubik font-semibold text-heading-3 mx-4 mt-4 ">Résumé de la commande</p>

    <p class="font-rubik font-semibold text-heading-3 mx-4 mt-4 mb-2">Itinéraire</p>
    <a v-if="mapLink" :href="mapLink" class="border-none shadow-lg p-2 m-2 bg-black font-rubik text-heading-3 text-white rounded-lg ">Voir l'itinéraire</a>
    <validate-delivery-button :order_reference="orderDeliveryInfos.order_reference"/>
  </div>

</template>

<style scoped>

</style>
