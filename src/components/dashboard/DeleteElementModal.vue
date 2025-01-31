<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { initFlowbite, Modal, type ModalInterface } from 'flowbite'

  const props = defineProps<{
    elementName:string,
    elementId?:number,
  }>();
  const  emit = defineEmits<{
    (event:'delete-element',elementToDelete:number):number,
    (event:'hide-modal'):void,
  }>()

  const deleteElementModal = ref<ModalInterface>();
  const elementToDelete = ref<number>()

  const createModal = () => {
    const modal = document.getElementById('popup-modal-element-delete');
    if (modal){
      deleteElementModal.value = new Modal(modal,{onHide:()=>{elementToDelete.value=undefined;emit('hide-modal')}});
    }
  }

  const showModal = ()=>{
    if(deleteElementModal.value){
      deleteElementModal.value.show();
    }
  }

  const deleteElement = () =>{
    if (deleteElementModal.value && elementToDelete.value){
      emit('delete-element',elementToDelete.value);
      deleteElementModal.value.hide()
    }else{
      console.log("Echec de l'opération");
    }
  }


  onMounted(()=>{
    createModal();
    initFlowbite();
  })

  watch(()=>props.elementId,(newValue)=>{
    if (newValue!=elementToDelete.value){
      elementToDelete.value=newValue;
      showModal();
    }
  })
</script>

<template>
  <div id="popup-modal-element-delete" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <div v-if="deleteElementModal && elementToDelete" class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" @click="deleteElementModal.hide()" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez-vous vraiment supprimer {{elementName}} ?</h3>
          <button @click="deleteElement()" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
            Supprimer
          </button>
          <button @click="deleteElementModal.hide()" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
