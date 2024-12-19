<script setup lang="ts">
  import { useUserStore } from '@/stores/dashboard/user'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'

  const userStore = useUserStore();
  const router = useRouter();
  const query = new URLSearchParams(window.location.search);
  const code = query.get('code');

  const handleGoogleCallback = async () => {
    if (code){
      if (await userStore.handleGoogleCallback(code)){
        if(await userStore.getCurrentUser()) await router.replace({ name: 'home' });
      }else{
        await router.replace({ name: 'login' });
      }
    }else{
      await router.replace({ name: 'login' });
    }
  }

  onMounted(handleGoogleCallback);
</script>

<template>

</template>

<style scoped>

</style>
