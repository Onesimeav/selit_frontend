<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'

const emit = defineEmits<{
  (event:'change-status',status:string):string
  (event:'reset-status'):void
}>()

const orderStatus:{key:string,value:string}[] =[
  {key:'',value:'Tout'},
  {key:'Pending',value:'En attente de validation'},
  {key:'Approved',value:'Approuvé'},
  {key:'Delivery in progress', value:'Livraison en cours'},
  {key:'Delivered',value:'Livrée'},
  {key:'Finished',value:'Terminée'},
  {key:'Canceled',value:'Annulée'},
]
const actualStatus = ref<{key:string,value:string}>({key:'',value:'Tout'},)


const changeStatus = (status:{key:string,value:string})=>{
  if (status.value=='Tout'){
    actualStatus.value=status;
    emit('reset-status')
  }else{
    actualStatus.value = status;
    emit('change-status',status.key);
  }
}

onMounted(()=>{
  initFlowbite();
})
</script>

<template>
  <button id="orderStatusDropdownButton" data-dropdown-toggle="orderStatusDropdown" data-dropdown-trigger="hover" type="button" class="m-4">
    <div class="flex justify-between items-center grid-cols-8">
      <div
        :class="{'text-yellow-400 bg-yellow-100':actualStatus.key=='Pending'|| actualStatus.key==='Approved'|| actualStatus.key==='Delivery in progress',
                  'text-green-800 bg-green-300':actualStatus.key==='Delivered'|| actualStatus.key==='Finished',
                  'text-red-800 bg-red-400':actualStatus.key=='Canceled',
                  'bg-blue-400 text-white':actualStatus.key==''
        }"
        class="col-span-2 rounded-md bg-blue-400 px-2 py-1 m-2 font-bold"
      >
        {{actualStatus.value}}
      </div>
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
  <div  id="orderStatusDropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="orderStatusDropdownButton">
      <li>
        <button v-for="(status,index) in orderStatus" :key="index" @click="changeStatus(status)"  class=" w-full block px-4 py-2 hover:bg-gray-100 ">{{status.value}}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
