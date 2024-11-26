<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { initFlowbite, Modal } from 'flowbite'

const props = defineProps<{
    orderStep:number;
  }>();
const emit = defineEmits<{
  (event:'cancel-order',userCode:number):number;
}>()
const userSecret = ref<number>();

const cancelOrder = ()=>{
  if (userSecret.value){
    const modalElement = document.getElementById('cancel-order-modal');
    const modal = new Modal(modalElement);
    modal.hide();
    emit('cancel-order',userSecret.value);
  }
}
onMounted(initFlowbite);
</script>

<template>

  <div v-if="props.orderStep<4" class="flex fixed w-full bottom-0  z-20 justify-center items-center mt-4">
    <button data-modal-target="cancel-order-modal" data-modal-toggle="cancel-order-modal" :disabled="props.orderStep>=3" :class="props.orderStep>=3?'bg-gray-500':'bg-appBlack'" type="button" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md bg-appBlack hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Annuler
    </button>
  </div>
  <div id="cancel-order-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold font-rubik text-gray-900 dark:text-white">
            Entrez le code secret reçu dans le mail de la commande
          </h3>
          <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="cancel-order-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <form class="space-y-4" @submit.prevent="cancelOrder()">
            <div>
              <label for="secret" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
              <input type="text" v-model="userSecret" name="email" id="secret" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="123456" required />
            </div>
            <button type="submit" class="w-full text-white bg-appBlack hover:bg-black  focus:outline-none font-rubik font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ">Confirmer commande</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
