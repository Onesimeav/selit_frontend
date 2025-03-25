<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Dismiss, type DismissInterface, type DismissOptions } from 'flowbite'

const props = defineProps<{
  message?: string,
  show?:false|boolean,
}>();

const options: DismissOptions = {
  transition: 'transition-opacity',
  duration: 1000,
  timing: 'ease-out',
};
const showToast = ref<boolean>(false);


const dismissToast = () =>{
  const toast = document.getElementById('toast-danger');
  if (toast){
    const dismiss: DismissInterface = new Dismiss(toast,undefined,options,undefined);
    setTimeout(()=>{
      dismiss.hide();
      showToast.value = false;
    },3000);
  }

}

watch(()=>props.show,(newValue)=>{
  if (newValue){
    showToast.value = true;
    nextTick(()=>{
      dismissToast();
    })
  }
})

</script>

<template>
  <div v-if="showToast" id="toast-danger" class="flex fixed z-50 bottom-5 right-5 items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ message }}</div>
  </div>
</template>

<style scoped>

</style>
