<script setup lang="ts">

import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useRouter } from 'vue-router'

const props = defineProps<{
  routeName:string,
}>();
const router =useRouter();

const redirectToPage = ()=>{
  router.push({name:props.routeName});
}

onMounted(initFlowbite)
</script>

<template>
  <button @click="redirectToPage" type="button" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
    <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
    </svg>
    Nouveau
  </button>
</template>

<style scoped>

</style>
