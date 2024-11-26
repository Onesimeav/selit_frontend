<script setup lang="ts">
  import type { Order } from '@/models/order'
  import OrderCard from '@/components/shop/OrderCard.vue'
  import { onMounted } from 'vue'
  import { initFlowbite } from 'flowbite'

  const props = defineProps<{
    ordersInProcessing:Order[];
    ordersFinished:Order[];
    ordersCancelled:Order[];
  }>()

  onMounted(initFlowbite);
</script>

<template>
  <div class="flex items-center justify-center mb-4 border-b border-gray-200 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px text-md font-medium text-center" id="default-styled-tab" data-tabs-toggle="#default-styled-tab-content" data-tabs-active-classes="text-black hover:text-black dark:text-purple-500 dark:hover:text-purple-500 border-black dark:border-purple-500" data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300" role="tablist">
      <li class="me-2" role="presentation">
        <button class="inline-block p-4 border-b-4 rounded-t-lg" id="processing-styled-tab" data-tabs-target="#styled-processing" type="button" role="tab" aria-controls="profile" aria-selected="false">En cours</button>
      </li>
      <li class="me-2" role="presentation">
        <button class="inline-block p-4 border-b-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="delivered-styled-tab" data-tabs-target="#styled-delivered" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Terminer</button>
      </li>
      <li class="me-2" role="presentation">
        <button class="inline-block p-4 border-b-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="finished-styled-tab" data-tabs-target="#styled-cancelled" type="button" role="tab" aria-controls="settings" aria-selected="false">Annuler</button>
      </li>
    </ul>
  </div>
  <div id="default-styled-tab-content">
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="styled-processing" role="tabpanel" aria-labelledby="profile-tab">
      <div v-for="(order, id) in props.ordersInProcessing" :key="id">
        <order-card :order="order"/>
      </div>
    </div>
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="styled-delivered" role="tabpanel" aria-labelledby="dashboard-tab">
      <div v-for="(order, id) in props.ordersFinished" :key="id">
        <order-card :order="order"/>
      </div>
    </div>
    <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="styled-cancelled" role="tabpanel" aria-labelledby="settings-tab">
      <div v-for="(order, id) in props.ordersCancelled" :key="id">
        <order-card :order="order"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
