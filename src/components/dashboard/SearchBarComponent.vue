<script setup lang="ts">
  import { ref } from 'vue'

  const emit = defineEmits<{
    (event:'search',searchTerm:string):string,
    (event:'reset-search-filter'):void
  }>()
  const searchTerm = ref<string>();

  const search = ()=>{
    if (searchTerm.value){
      emit('search',searchTerm.value);
    }else{
      console.log('Veuillez remplir le formulaire')
    }
  }

  const resetSearchFilter = () => {
    searchTerm.value=undefined
    emit('reset-search-filter');
  }

</script>

<template>
  <form class="flex items-center max-w-sm mx-auto" @submit.prevent="search">
    <label for="simple-search" class="sr-only">Chercher un mot clé</label>
    <div class="relative w-full">
      <div v-if="searchTerm" @click="resetSearchFilter" class="absolute inset-y-0 z-20 end-1/3 flex items-center ps-3 ">
        <svg class="w-4 h-4  text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      </div>
      <input type="text" v-model="searchTerm" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-1.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Cherchez un mot clé" required />
    </div>
    <button type="submit" class="p-2 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
      </svg>
      <span class="sr-only">Search</span>
    </button>
  </form>

</template>

<style scoped>

</style>
