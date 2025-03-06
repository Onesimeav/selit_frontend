<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'

const emit = defineEmits<{
  (event:'change-period',period:string):string
}>()
const actualPeriod = ref('Monthly');
const periods = ["Daily","Monthly","Weekly","Yearly"]

const changePeriod = (period: string)=>{
  actualPeriod.value = period;
  emit('change-period',period);
}

onMounted(() =>{
  initFlowbite();
});

</script>

<template>
  <button id="dropdownHoverButtonPeriod" data-dropdown-toggle="dropdownHoverPeriod" data-dropdown-trigger="hover" type="button" class="m-4">
    <div class="flex justify-between items-center grid-cols-8">
      <div class="col-span-2 rounded-md bg-blue-400 px-2 py-1 m-2 text-white font-bold">{{actualPeriod}}</div>
      <div class="col-span-6 grid-cols-4 flex items-center justify-around">
        <div class="col-span-2 font-poppins font-normal text-normal-text text-appGray">Période</div>
        <div class="col-span-2">
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
          </svg>
        </div>
      </div>
    </div>
  </button>

  <!-- Dropdown menu -->
  <div  id="dropdownHoverPeriod" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButtonPeriod">
      <li>
        <button v-for="(period, index) in periods" :key="index" @click="changePeriod(period)"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{{period}}</button>
      </li>
    </ul>
  </div>

</template>

<style scoped>

</style>
