<script setup lang="ts">
  import { useWithdrawalsStore } from '@/stores/admin/withdrawals'
  import { onMounted, ref, watch } from 'vue'
  import type { Page } from '@/models/page'
  import type { Withdrawals } from '@/models/withdrawals'
  import DefaultSuccesToast from '@/components/utils/DefaultSuccesToast.vue'
  import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'
  import { initFlowbite, Modal, type ModalInterface } from 'flowbite'
  import DefaultLoader from '@/components/utils/DefaultLoader.vue'

  const withdrawalsStore = useWithdrawalsStore();

  const withdraws = ref<Page<Withdrawals>>();
  const loading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');
  const showErrorMessage = ref(false);
  const showSuccessMessage = ref(false);
  const page = ref(1);
  const withdrawModal = ref<ModalInterface>();
  const withdrawToValidate = ref<number>();


  const createModal =()=>{
    showErrorMessage.value=false;
    const modal= document.getElementById('validate-withdraw-modal');
    if (modal){
      withdrawModal.value = new Modal(modal);
    }else{
      errorMessage.value="Une erreur est survenue, veuillez recharger la page";
      showErrorMessage.value=true;
    }
  }

  const getWithdrawalsRequest = async ()=>{
    loading.value = true;
    showErrorMessage.value = false;
    showSuccessMessage.value = false;
    await withdrawalsStore.getWithdrawalsRequests(page.value>1?page.value:undefined);
    loading.value=false
    if (!withdrawalsStore.withdrawals){
      errorMessage.value="Une erreur est survenue, veuillez recharger la page";
      showErrorMessage.value = true;
    }
  }

  const initWithdrawValidation=(withdrawId:number)=>{
    showErrorMessage.value=false;
    withdrawToValidate.value=withdrawId;
    if (withdrawModal.value){
      withdrawModal.value.show();
    }else{
      errorMessage.value="Une erreur est survenue, veuillez recharger la page";
      showErrorMessage.value = true;
    }
  }

  const validateWithdrawalRequest= async () =>{
    loading.value = true;
    showErrorMessage.value = false;
    showSuccessMessage.value = false;
    if (withdrawToValidate.value){
      if (await withdrawalsStore.validateWithdrawalRequest(withdrawToValidate.value)){
        if (withdraws.value && withdraws.value.data){
          withdraws.value.data.forEach(withdraw=>{
            if (withdraw.id===withdrawToValidate.value){
              withdraw.status=true;
            }
          })
        }
        loading.value = false;
        if (withdrawModal.value){
          withdrawModal.value.hide()
          successMessage.value="Demande validée";
          showSuccessMessage.value = true;
        }else{
          errorMessage.value="Une erreur est survenue, veuillez recharger la page";
          showErrorMessage.value = true;
        }
      }else{
        loading.value = false;
        if (withdrawModal.value){
          withdrawModal.value.hide()
          errorMessage.value="Echec de l'opération";
          showErrorMessage.value = true;
        }else{
          errorMessage.value="Une erreur est survenue, veuillez recharger la page";
          showErrorMessage.value = true;
        }
      }
    }else{
      errorMessage.value="Une erreur est survenue, veuillez recharger la page";
      showErrorMessage.value = true;
    }

  }

  const loadMore = async ()=>{
    page.value+=1;
    await getWithdrawalsRequest();
  }

  onMounted(async ()=>{
    initFlowbite();
    createModal();
    await getWithdrawalsRequest();
  })

  watch(()=>withdrawalsStore.withdrawals,(newData)=>{
    if (newData){
      withdraws.value = newData;
    }
  })
</script>

<template>
  <default-succes-toast :show="showSuccessMessage" :message="successMessage"/>
  <default-error-toast :show="showErrorMessage" :message="errorMessage" />
  <div class="p-4 mt-24 sm:ml-64">
    <div v-if="withdraws" class="relative font-poppins overflow-x-auto shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs font-bold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Email
          </th>
          <th scope="col" class="px-6 py-3">
            Nom
          </th>
          <th scope="col" class="px-6 py-3">
            Montant
          </th>
          <th scope="col" class="px-6 py-3">
            Action
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(withdraw,index) in withdraws.data" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
          <th scope="row" class="px-6 py-4" >
            {{withdraw.user.email}}
          </th>
          <td class="px-6 py-4 font-medium text-gray-800 ">
            {{withdraw.user.name}}
          </td>
          <td class="px-6 py-4">
            {{withdraw.amount}}
          </td>
          <td class="px-6 py-4 flex justify-center items-center">
            <button v-if="!withdraw.status" @click="initWithdrawValidation(withdraw.id)" class="rounded-md px-6 py-2 bg-green-500 font-poppins font-semibold text-heading-3 text-white">
              Valider
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="grid grid-cols-8 m-6">
        <div class="col-span-4"></div>
        <button v-if="withdraws.per_page<withdraws.total" @click="loadMore()" class=" col-span-2 border-2 rounded-full w-1/2 px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
        <p class="col-span-2 font-poppins font-semibold text-heading-3 ">Total: <span class="font-normal">{{withdraws.total}}</span></p>
      </div>
    </div>
    <div v-else class=" w-full justify-center items-center">
      <p class="font-poppins font-normal text-normal-text text-appGray">Aucune demande de retrait disponible</p>
    </div>
  </div>

  <div id="validate-withdraw-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div v-if="withdrawModal" class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <button type="button" @click="withdrawModal.hide()" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez vous vraiment valider cette demande?</h3>
          <button @click="validateWithdrawalRequest()" type="button" class="text-white bg-appBlue  dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
            <default-loader v-if="loading" :loading="loading"/>
            <span v-else >Oui, valider</span>
          </button>
          <button @click="withdrawModal.hide()" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
