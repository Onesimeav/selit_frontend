<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter();
  const props = defineProps<{
    ordersCount:number;
  }>()

  const redirectToOrderPage = ()=>{
    router.push('orders');
  }
</script>

<template>
    <div @click="redirectToOrderPage" class="bg-white drop-shadow-md flex justify-between h-full items-center pb-3 pt-1.5 px-2.5 ">
      <p class="text-appBlack font-rubik font-semibold text-heading-3">
        Commandes<br>
        <span class="font-regular text-normal-text">Vous avez {{props.ordersCount}} commandes en cours</span>
      </p>
      <div class="">
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
</template>

<style scoped>

</style>
