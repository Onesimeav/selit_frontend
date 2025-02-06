<script setup lang="ts">

import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { onMounted, ref } from 'vue'
import type { Order } from '@/models/order'
import { useDashboardOrderStore } from '@/stores/dashboard/order'
import { useRoute } from 'vue-router'
import type { DeliveryMan } from '@/models/deliveryMan'
import Pusher from 'pusher-js'
import OrderSummaryCard from '@/components/shop/OrderSummaryCard.vue'
import { initFlowbite, Modal, type ModalInterface } from 'flowbite'

const orderStore = useDashboardOrderStore();
const route = useRoute()

const order = ref<Order>();
const deliveryMan= ref<DeliveryMan>();
const orderStatus = ref<string>();
const step = ref<number>();
const orderPrice = ref<number>(0);
const deliveryModal = ref<ModalInterface>();
const cancelOrderModal = ref<ModalInterface>();
const createDeliveryMan = ref<DeliveryMan>({});

const getOrderDetails =async () => {
  const response= await orderStore.getOrder(Number(route.params.id));
  order.value = response[0]
  orderStatus.value=order.value.status;
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

const getDeliveryManDetails = async ()=>{
  if (order.value){
    deliveryMan.value = await orderStore.getDeliveryMan(order.value.order_reference,order.value.shop_id);
  }else {
    console.log("Echec de l'opération")
  }
}

const approveOrder = async ()=>{
  if (order.value){
    if (await orderStore.approveOrder(order.value.id)){}else{
      console.log("Echec de l'opération")
    }
  }
}

const verifyDeliveryManInfos = ()=>{
  return createDeliveryMan.value && createDeliveryMan.value.name!=="" && createDeliveryMan.value.number!==null && createDeliveryMan.value.surname!=="" && createDeliveryMan.value.email!=="";
}

const sendToDeliveryMan = async ()=>{
  if (verifyDeliveryManInfos() && order.value && createDeliveryMan.value && deliveryModal.value){
    if (await orderStore.deliverOrder(order.value.id, createDeliveryMan.value.email,createDeliveryMan.value.name,createDeliveryMan.value.surname,createDeliveryMan.value.number)){
      console.log('Opération réussie');
      deliveryModal.value.hide();
    }else {
      console.log("Echec de l'opération");
      deliveryModal.value.hide();
    }
  }
}

const cancelOrder = async ()=>{
  if (order.value && cancelOrderModal.value){
    if (await orderStore.cancelOrder(order.value.order_reference)){
      console.log('Opération réussie');
      cancelOrderModal.value.hide();
    }else {
      console.log("Echec de l'opération");
      cancelOrderModal.value.hide();
    }
  }
}

const getOrderInvoice = async ()=>{
  if(order.value){
    if (await orderStore.getOrderInvoice(order.value.order_reference)){
      console.log('Opération réussie');
    }else{
      console.log("Echec de l'opération");
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
      getDeliveryManDetails();
      break;
    case 'Delivered':
      step.value=4;
      getDeliveryManDetails();
      break;
    case 'Finished':
      step.value=5;
      getDeliveryManDetails();
      break;
    case 'Canceled':
      step.value=6;
      getDeliveryManDetails();
      break;
    default:
      step.value=1;
  }
}

const  createModals =()=>{
  const cancelModal = document.getElementById('cancel-order-modal');
  const deliveryForm = document.getElementById('delivery-form-modal');

  if(cancelModal && deliveryForm){
    cancelOrderModal.value = new Modal(cancelModal);
    deliveryModal.value= new Modal(deliveryForm);
  }else {
    console.log("Une erreur s'est produite,veuillez recharger la page")
  }

}


onMounted(async () => {
  await getOrderDetails();
  initFlowbite();
  createModals();
  const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY,{cluster:import.meta.env.VITE_PUSHER_CLUSTER});
  const channel = pusher.subscribe(`order-status-${ order.value?.id}`);
  channel.bind('order-status-change',function(data:{orderId:number,orderStatus:string}){
    orderStatus.value=data.orderStatus;
    setOrderStep();
  })
})
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Détails de la commande</p>
      </div>
    </div>
    <div v-if="order">
      <div class="lg:grid grid-cols-8 mb-5 items-center">
        <p class="col-span-5 font-bold font-poppins text-heading-2 text-gray-500 mb-5">Numéro: <span class="text-black text-heading-3">{{order.order_reference}}</span></p>
        <div class="col-span-3 flex items-center font-bold font-poppins text-heading-2 text-gray-500 mb-5">Status:
          <div
            :class="{'text-yellow-400 bg-yellow-100':orderStatus=='Pending'|| orderStatus==='Approved'|| orderStatus==='Delivery in progress',
                  'text-green-800 bg-green-300':orderStatus==='Delivered'|| orderStatus==='Finished',
                  'text-red-800 bg-red-400':orderStatus=='Canceled',
            }"
            class="rounded-lg px-2 py-1 ml-1 font-bold"
          >
            <p v-if="orderStatus==='Pending'">En attente de validation</p>
            <p v-if="orderStatus==='Approved'">Approuvé</p>
            <p v-if="orderStatus==='Delivery in progress'">Livraison en cours</p>
            <p v-if="orderStatus==='Delivered'">Livrée</p>
            <p v-if="orderStatus==='Finished'">Terminée</p>
            <p v-if="orderStatus==='Canceled'">Annulée</p>
          </div>
        </div>
      </div>
      <div v-if="step" class="flex mx-8 mb-5">
        <button v-if="step===1" type="button" @click="approveOrder()" class="rounded-lg bg-blue-700 px-6 py-3 font-bold font-rubik text-white text-heading-3 hover:bg-blue-600 mx-4">Approuver la commande</button>
        <button v-if="step===2 && deliveryModal" type="button" @click="deliveryModal.show()" class="rounded-lg bg-blue-700 px-6 py-3 font-bold font-rubik text-white text-heading-3 hover:bg-blue-600 mx-4">Envoyer au livreur</button>
        <button v-if="step<5 && cancelOrderModal" type="button" @click="cancelOrderModal.show()" class="rounded-lg bg-red-700 px-6 py-3 font-bold font-rubik text-white text-heading-3 hover:bg-red-600 mx-4">Annuler</button>
        <button v-if="step===6" @click="getOrderInvoice()" type="button" class="rounded-lg bg-blue-700 px-6 py-3 font-bold font-rubik text-white text-heading-3 hover:bg-blue-600 mx-4">Recevoir le facture par mail</button>
      </div>
      <div class="lg:grid grid-cols-12 mx-4">
        <div class="col-span-7 px-4 ">
          <div class="rounded-lg border border-gray-300 px-2 py-4 my-4">
            <div class="grid grid-cols-8 gap-4">
              <div class="col-span-2 flex flex-col justify-center items-center">
                <div class="rounded-full bg-neutral-400 flex items-center justify-center p-4 m-2">
                  <svg class="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <p class="font-rubik font-bold text-heading-3" >Acheteur</p>
              </div>
              <div class="col-span-6 mx-2">
                <div class="flex space-x-8">
                  <p class="font-medium font-poppins text-heading-3 text-gray-500 mb-5">Nom: <span class="text-black text-heading-3">{{order.surname}}</span></p>
                  <p class="font-medium  font-poppins text-heading-3 text-gray-500 mb-5">Prénom: <span class="text-black text-heading-3">{{order.name}}</span></p>
                </div>
                <p class="font-medium  font-poppins text-heading-3 text-gray-500 mb-5">Email: <span class="text-black text-heading-3">{{order.email}}</span></p>
                <p class="font-medium font-poppins text-heading-3 text-gray-500 mb-5">Téléphone: <span class="text-black text-heading-3">{{order.number}}</span></p>
                <p class="font-medium  font-poppins text-heading-3 text-gray-500 mb-5">Adresse: <span class="text-black text-heading-3">{{order.address}}</span></p>
              </div>
            </div>
          </div>
          <div v-if="deliveryMan" class="rounded-lg border border-gray-300 px-2 py-4">
            <div class="grid grid-cols-8 gap-4">
              <div class="col-span-2 flex flex-col justify-center items-center">
                <div class="rounded-full bg-neutral-400 flex items-center justify-center p-4 m-2">
                  <svg class="w-10 h-10 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h.535a3.5 3.5 0 1 0 6.93 0h3.07a3.5 3.5 0 1 0 6.93 0H21a1 1 0 0 0 1-1v-4a.999.999 0 0 0-.106-.447l-2-4A1 1 0 0 0 19 6h-5a2 2 0 0 0-2-2H4Zm14.192 11.59.016.02a1.5 1.5 0 1 1-.016-.021Zm-10 0 .016.02a1.5 1.5 0 1 1-.016-.021Zm5.806-5.572v-2.02h4.396l1 2.02h-5.396Z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <p class="font-rubik font-bold text-heading-3" >Livreur</p>
              </div>
              <div class="col-span-6 mx-2">
                <div class="flex space-x-8">
                  <p class="font-medium font-poppins text-heading-3 text-gray-500 mb-5">Nom: <span class="text-black text-heading-3">{{deliveryMan.surname}}</span></p>
                  <p class="font-medium  font-poppins text-heading-3 text-gray-500 mb-5">Prénom: <span class="text-black text-heading-3">{{deliveryMan.name}}</span></p>
                </div>
                <p class="font-medium  font-poppins text-heading-3 text-gray-500 mb-5">Email: <span class="text-black text-heading-3">{{deliveryMan.email}}</span></p>
                <p class="font-medium font-poppins text-heading-3 text-gray-500 mb-5">Téléphone: <span class="text-black text-heading-3">{{deliveryMan.number}}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-5 px-4 ">
          <div class="font-bold font-poppins text-heading-2 m-2">Produits</div>
          <div v-for="orderProduct in order.orderProducts" :key="orderProduct.id">
            <order-summary-card :order-product="orderProduct"/>
          </div>
          <p class="font-bold font-poppins text-heading-3 text-gray-500 mb-5 mt-24">Total: <span class="text-black text-heading-3">{{orderPrice}}</span></p>
        </div>
      </div>
    </div>

    <!--Cancel order modal -->
    <div id="cancel-order-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div v-if="cancelOrderModal" class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <button type="button" @click="cancelOrderModal.hide()" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez-vous vraiment annuler cette commande </h3>
            <button type="button" @click="cancelOrder()" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
              Confirmer
            </button>
            <button @click="cancelOrderModal.hide()"  type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Annuler</button>
          </div>
        </div>
      </div>
    </div>

    <!--Delivery modal -->
    <div id="delivery-form-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div  v-if="deliveryModal" class="relative p-4 w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Envoyer la commande au livreur
            </h3>
            <button @click="deliveryModal.hide()" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <form class="p-4 md:p-5" @submit.prevent="sendToDeliveryMan()">
            <div class="grid gap-4 mb-4 grid-cols-2">
              <div class="col-span-2 sm:col-span-1">
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
                <input type="text" v-model="createDeliveryMan.name" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Gontrand" required>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
                <input type="text" v-model="createDeliveryMan.surname" name="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Vincent" required>
              </div>
              <div class="col-span-2">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" v-model="createDeliveryMan.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="gontran@vincent.com" required>
              </div>
              <div class="col-span-2">
                <label for="number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Téléphone</label>
                <input type="tel" name="number" v-model="createDeliveryMan.number" id="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}" placeholder="12345678" required>
              </div>
            </div>
            <button type="submit" :disabled="!verifyDeliveryManInfos()" :class="verifyDeliveryManInfos()?'bg-blue-700':'bg-blue-500'" class="text-white inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>
