<script setup lang="ts">
  import type { DeliveryMan } from '@/models/deliveryMan'
  import { onMounted } from 'vue'
  import { initFlowbite } from 'flowbite'

  const props = defineProps<{
    deliveryMan:DeliveryMan
  }>()

  onMounted(initFlowbite);
</script>

<template>
  <div class="border-none my-2 h-2 bg-gray-200"></div>
  <div class="grid grid-cols-8 m-2">
    <div class="col-span-2 border-2 border-appGray m-2 rounded-xl p-2 flex justify-center">
      <svg class="w-9 h-9 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M2.586 4.586A2 2 0 0 1 4 4h8a2 2 0 0 1 2 2h5a1 1 0 0 1 .894.553l2 4c.07.139.106.292.106.447v4a1 1 0 0 1-1 1h-.535a3.5 3.5 0 1 1-6.93 0h-3.07a3.5 3.5 0 1 1-6.93 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 .586-1.414ZM18.208 15.61a1.497 1.497 0 0 0-2.416 0 1.5 1.5 0 1 0 2.416 0Zm-10 0a1.498 1.498 0 0 0-2.416 0 1.5 1.5 0 1 0 2.416 0Zm5.79-7.612v2.02h5.396l-1-2.02h-4.396ZM9 8.667a1 1 0 1 0-2 0V10a1 1 0 0 0 .293.707l1.5 1.5a1 1 0 0 0 1.414-1.414L9 9.586v-.92Z" clip-rule="evenodd"/>
      </svg>
    </div>
    <div class="col-span-4 p-1 m-2 ">
      <p class="font-rubik font-bold text-heading-3">{{props.deliveryMan.name}} {{props.deliveryMan.surname}}</p>
      <p class="font-rubik font-normal text-appGray text-normal-text">Livreur personnel</p>
    </div>
    <div class="col-span-2 p-1 m-2 flex justify-center items-center">
      <button id="dropdownMenuIconHorizontalButton" data-dropdown-toggle="dropdownDotsHorizontal" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-full shadow-lg hover:bg-gray-100 dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600" type="button">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
        </svg>
      </button>

      <!-- Dropdown menu -->
      <div id="dropdownDotsHorizontal" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
        <ul class="py-2 text-normal-text font-rubik font-normal dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
          <li>
            <a :href="'tel:+229'+props.deliveryMan.number" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Appeller</a>
          </li>
          <li>
            <a :href="'mailto:'+props.deliveryMan.email" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Envoyer un mail</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
