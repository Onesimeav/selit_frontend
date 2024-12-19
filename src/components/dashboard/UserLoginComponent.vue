<script setup lang="ts">
import GoogleLoginButton from '@/components/dashboard/GoogleLoginButton.vue'
import UserLoginForm from '@/components/dashboard/UserLoginForm.vue'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'

  const userStore = useUserStore();
  const router = useRouter();
  const login = async (email:string,password:string)=>{
    if (await userStore.login(email,password)){
      await router.push({ name: 'home' });
    }
  }
  const redirectToSignUpPage = ()=>{
    router.push('/sign-up')
  }

onMounted(initFlowbite);
</script>

<template>
  <div class="flex items-center justify-center self-center">
    <div class="flex flex-col items-center" >
      <img src="@/assets/selit-short-logo.png" class="h-[190px]" >
      <p class="font-poppins font-medium text-heading-1">Connectez-vous </p>
      <google-login-button class="m-6"/>
      <div class=" flex items-center justify-center mb-8">
        <div class="border-t border-gray-400 px-20 w-full h-1"></div>
        <p class="font-rubik font-medium text-heading-3 text-gray-800 px-2">OU</p>
        <div class="border-t border-gray-400 px-20 w-full h-1"></div>
      </div>
      <user-login-form class="w-full" @login="loginInfo => {login(loginInfo.email,loginInfo.password)}"/>
      <div class="border-t border-gray-400 px-20 w-full h-1 m-6"></div>
      <p class="font-poppins font-medium text-heading-3 ">Vous n'avez pas de compte ?</p>
      <button @click="redirectToSignUpPage" class="border-2 border-gray-600 font-poppins font-medium text-heading-3 text-appBlue hover:text-white hover:bg-appBlue rounded-full px-14 py-2 w-full m-4 hover:border-none ">S'inscrire</button>
    </div>
  </div>
</template>

<style scoped>

</style>
