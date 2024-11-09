<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCartStore } from '@/stores/shop/carts'
import { initFlowbite } from 'flowbite'

const disable = ref(true);
const cartStore = useCartStore();
const order = ref({
  name: "",
  surname: "",
  email: "",
  number: null as number|null,
})
const emit = defineEmits<{
    (event:'placeOrder',
     userInfo:{name:string,
      surname: string,
      email: string,
      number: number,}
    ):{name:string, surname: string, email: string, number: number,};
  }>()
const validateOrderInfo = ()=>{
  return order.value.name && order.value.surname && order.value.email && order.value.number;
}
const placeOrder=()=>{
  if (validateOrderInfo()){
    emit('placeOrder',order.value as {name:string, surname: string, email: string, number: number,})
  }else {
    console.log('fill all the input of the form')
  }
}
watch(()=>cartStore.loading,(newLoading)=>{
  disable.value = newLoading;
})
onMounted(initFlowbite);
</script>

<template>
  <div class="flex justify-center items-center my-4">
    <button type="button" data-modal-target="authentication-modal" data-modal-toggle="authentication-modal" :disabled="disable" :class="disable?'bg-gray-500':'bg-appBlack'" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md  hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Commander
    </button>
  </div>
  <!-- Main modal -->
  <div id="authentication-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold font-rubik text-gray-900 dark:text-white">
            Terminez votre commande
          </h3>
          <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <form class="space-y-4" @submit.prevent="placeOrder()">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input type="email" v-model="order.email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
            </div>
            <div>
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
              <input type="text" v-model="order.name" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="John" required />
            </div>
            <div>
              <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
              <input type="text" v-model="order.surname" name="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Doe" required />
            </div>
            <div>
              <label for="phone-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Numéro de téléphone:</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 19 18">
                    <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z"/>
                  </svg>
                </div>
                <input type="tel" v-model="order.number" id="phone-input" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}" placeholder="12345678" required />
              </div>
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
