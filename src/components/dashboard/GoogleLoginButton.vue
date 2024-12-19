<script setup lang="ts">
  import { useUserStore } from '@/stores/dashboard/user'

  const useStore = useUserStore();
  const googleLogin = async ()=>{
    await useStore.googleLogin();
  }
</script>

<template>
  <button @click="googleLogin" class="flex items-center justify-around border-2 rounded-full border-gray-600 px-14 py-2" >
    <img src="@/assets/google-logo.png" class="h-[24px]">
    <p class="font-rubik font-normal text-normal-text text-gray-500">Connecter vous avez Google</p>
  </button>
</template>

<style scoped>

</style>
