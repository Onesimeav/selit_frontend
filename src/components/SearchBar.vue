<script setup lang="ts">
const props = defineProps<{
  blackVersion:boolean
}>()
</script>

<template>
    <form class="m-1 px-1.5 max-w-screen-lg mx-auto w-full" :class="{'hidden': blackVersion}">
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div class="relative ">
        <div class=" absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-appBlack dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input type="search" id="default-search" class=" placeholder-gray-800 border-none bg-appGray block w-full p-4 ps-10 text-md text-appBlack rounded-lg focus:ring-appBlack focus:border-appBlack " placeholder="Search a product on SanDiego" required />
        <button type="submit" class="text-white text-normal-text font-sora font-regular absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
      </div>
    </form>
  <form class="m-1 px-1.5 max-w-screen-lg mx-auto" :class="{'hidden': !blackVersion}">
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div class="relative ">
      <div class=" absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg class="w-4 h-4 text-white dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input type="search" id="default-search" class=" placeholder-gray-300 border-none bg-appBlack block w-full p-4 ps-10 text-md text-white rounded-lg focus:ring-appGray focus:border-appGray " placeholder="Search a product on SanDiego" required />
      <button type="submit" class="text-white text-normal-text font-sora font-regular absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
    </div>
  </form>
</template>

<style scoped>

</style>
