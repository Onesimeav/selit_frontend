<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'

const emit = defineEmits<{
  (event:'change-status',published:boolean):boolean,
  (event:'reset-shop-filter'):void,
}>()
const actualStatus = ref('Tout');

const changeStatus = (published?:boolean)=>{
  if (published==undefined){
    actualStatus.value='Tout';
    emit('reset-shop-filter');
  }else{
    if(published){
      actualStatus.value='Publié'
    }else{
      actualStatus.value='Non-publié';
    }
    emit('change-status',published);
  }
}

onMounted(() =>{
  initFlowbite();
});

</script>

<template>
  <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover" data-dropdown-trigger="hover" type="button" class="m-4">
    <div class="flex justify-between items-center grid-cols-8">
      <div class="col-span-2 rounded-md bg-blue-400 px-2 py-1 m-2 text-white font-bold">{{actualStatus}}</div>
      <div class="col-span-6 grid-cols-4 flex items-center justify-around">
        <div class="col-span-2 font-poppins font-normal text-normal-text text-appGray">Status</div>
        <div class="col-span-2">
          <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
          </svg>
        </div>
      </div>
    </div>
  </button>

  <!-- Dropdown menu -->
  <div  id="dropdownHover" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
      <li>
        <button @click="changeStatus()"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Toutes</button>
      </li>
      <li>
        <button @click="changeStatus(true)"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Publié</button>
      </li>
      <li>
        <button @click="changeStatus(false)"  class=" w-full block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Non-publié</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
