<script setup lang="ts">
  const props = defineProps<{
    name:string,
    surname:string,
    number:number,
    email:string,
  }>()
</script>

<template>
  <div class="grid grid-cols-8 m-2 items-center">
    <div class="col-span-2 border-2 border-appGray m-4 rounded-xl p-2 flex justify-center">
      <svg class="w-9 h-9 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
      </svg>
    </div>
    <div class="col-span-4 p-1 m-2 ">
      <p class="font-rubik font-bold text-heading-3">{{props.name}} {{props.surname}}</p>
      <p class="font-rubik font-normal text-appGray text-normal-text">Acheteur</p>
    </div>
    <div class="col-span-2 p-1 m-2 flex justify-center items-center">
      <a :href="'tel:+229'+props.number" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-full shadow-lg hover:bg-gray-100 dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <svg class="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>
