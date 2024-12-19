<script setup lang="ts">

import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import ForgotPasswordForm from '@/components/dashboard/ForgotPasswordForm.vue'

onMounted(initFlowbite)
</script>

<template>
  <div class="flex items-center justify-center self-center">
    <div class="flex flex-col items-center" >
      <img src="@/assets/selit-short-logo.png" class="h-[190px]" >
      <p class="font-poppins font-medium text-heading-1 mb-3">Changer de mot de passe</p>
      <forgot-password-form/>
    </div>
  </div>
</template>

<style scoped>

</style>
