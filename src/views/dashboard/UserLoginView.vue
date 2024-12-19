<script setup lang="ts">
import UserLoginComponent from '@/components/dashboard/UserLoginComponent.vue'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
onMounted(initFlowbite)
</script>

<template>
  <user-login-component/>
</template>

<style scoped>

</style>
