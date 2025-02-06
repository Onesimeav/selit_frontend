<script setup lang="ts">


import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import type { Page } from '@/models/page'
import type { Order } from '@/models/order'
import { useRouter } from 'vue-router'

const props = defineProps<{
  orders:Page<Order>
}>();
const emit = defineEmits<{
  (event:'load-more'):void
}>()
const router = useRouter();

const redirectToOrderDetailsPage = (orderId:number)=>{
  router.push(`/order/${orderId}`);
}
onMounted(()=>{
  initFlowbite()
})
</script>

<template>
  <div class="relative font-poppins overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs font-bold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          Numéro
        </th>
        <th scope="col" class="px-6 py-3">
          Nom
        </th>
        <th scope="col" class="px-6 py-3">
          Adresse
        </th>
        <th scope="col" class="px-6 py-3">
          Email
        </th>
        <th scope="col" class="px-6 py-3">
          Status
        </th>
      </tr>
      </thead>
      <tbody>
      <tr @click="redirectToOrderDetailsPage(order.id)" v-for="(order,index) in orders.data" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
        <th scope="row" class="px-6 py-4" >
         {{order.order_reference}}
        </th>
        <td class="px-6 py-4 font-medium text-gray-800 ">
          {{order.name }} {{order.surname}}
        </td>
        <td class="px-6 py-4">
          {{order.address}}
        </td>
        <td class="px-6 py-4">
          {{order.email}}
        </td>
        <td class="px-6 py-4">
          <div
            :class="{'text-yellow-400 bg-yellow-100':order.status=='Pending'|| order.status==='Approved'|| order.status==='Delivery in progress',
                  'text-green-800 bg-green-300':order.status==='Delivered'|| order.status==='Finished',
                  'text-red-800 bg-red-400':order.status=='Canceled',
            }"
            class="rounded-lg px-4 py-3 font-bold"
          >
            <p v-if="order.status=='Pending'">En attente de validation</p>
            <p v-if="order.status==='Approved'">Approuvé</p>
            <p v-if="order.status==='Delivery in progress'">Livraison en cours</p>
            <p v-if="order.status==='Delivered'">Livrée</p>
            <p v-if="order.status==='Finished'">Terminée</p>
            <p v-if="order.status=='Canceled'">Annulée</p>
          </div>
        </td>

      </tr>
      </tbody>
    </table>
    <div class="grid grid-cols-8 m-6">
      <div class="col-span-4"></div>
      <button v-if="orders.per_page<orders.total" @click="emit('load-more')" class=" col-span-2 border-2 rounded-full w-1/2 px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
      <p class="col-span-2 font-poppins font-semibold text-heading-3 ">Total: <span class="font-normal">{{orders.total}}</span></p>
    </div>
  </div>
</template>

<style scoped>

</style>
