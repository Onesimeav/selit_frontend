<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import NavbarComponent from '@/components/dashboard/NavbarComponent.vue'
  const userStore = useUserStore();
  const router = useRouter();
  const checkAccountVerification = async ()=>{
    while (userStore.loading){
      await new Promise(resolve => setTimeout(resolve,100));
    }
    if (userStore.currentUser){
      if (userStore.currentUser.email_verified_at){}
      else {
        await router.push('/verify-user');
      }
    }
  }


onMounted( ()=>{
  checkAccountVerification();
  initFlowbite();
})
</script>

<template>
  <navbar-component/>
  <router-view/>
</template>

<style scoped>

</style>
