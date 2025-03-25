<script setup lang="ts">
import UserLoginForm from '@/components/dashboard/UserLoginForm.vue'
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'

const userStore = useUserStore();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref<string>();
const showErrorToast = ref<boolean>(false);

const loginAdmin = async (email:string,password:string)=>{
  loading.value = true;
  showErrorToast.value = false;
  if (await userStore.loginAdmin(email,password)){
    loading.value = false;
    await router.push({ name: 'home' });
  }else{
    loading.value = false;
    errorMessage.value='Identifiants incorrectes';
    showErrorToast.value = true;
  }
}


onMounted(initFlowbite);
</script>

<template>
  <default-error-toast :message="errorMessage" :show="showErrorToast"/>
  <div class="flex items-center justify-center self-center">
    <div class="flex flex-col items-center" >
      <img src="@/assets/selit-short-logo.png" class="h-[190px]" >
      <p class="font-poppins font-medium text-heading-1">Connectez-vous </p>
      <div class="mx-16 w-full mt-8 ">
        <user-login-form class="w-full" @login="loginInfo => {loginAdmin(loginInfo.email,loginInfo.password)}" :loading="loading" :admin="true"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
