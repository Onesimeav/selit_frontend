<script setup lang="ts">
  import { onMounted } from 'vue'
  import { initFlowbite } from 'flowbite'
  import SignUpForm from '@/components/dashboard/SignUpForm.vue'
  import GoogleLoginButton from '@/components/dashboard/GoogleLoginButton.vue'

  onMounted(initFlowbite);
</script>

<template>
  <div class="flex items-center justify-center self-center">
    <div class="flex flex-col items-center" >
      <img src="@/assets/selit-short-logo.png" class="h-[190px]" >
      <p class="font-poppins font-medium text-heading-1 mb-3">Créer un compte</p>
      <p class="font-poppins font-normal text-normal-text">Vous avez déjà un compte? <a href="/login" class="text-appBlue underline">Connectez-vous</a></p>
      <sign-up-form/>
      <div class=" flex items-center justify-center mt-6">
        <div class="border-t border-gray-400 px-20 w-full h-1"></div>
        <p class="font-rubik font-medium text-heading-3 text-gray-800 px-2">OU</p>
        <div class="border-t border-gray-400 px-20 w-full h-1"></div>
      </div>
      <google-login-button class="m-6"/>
    </div>
  </div>
</template>

<style scoped>

</style>
