<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import { useRouter } from 'vue-router'
import DefaultLoader from '@/components/utils/DefaultLoader.vue'
  const props = defineProps<{
    loading?:boolean;
  }>()
  const router = useRouter();
  const emit = defineEmits<{
    (event:'login',loginInfo:{email:string,password:string}):{email:string,password:string};
  }>()

  const loginInfo =ref({
    email:'',
    password:'',
  })
  const showPassword = ref(false);


  const redirectToForgotPasswordPage =()=>{
    router.push('/forgot-password');
  }
  const login = ()=>{
    if(loginInfo.value.email!='' && loginInfo.value.password!=''){
      emit('login',loginInfo.value);
    }
  }
  onMounted(initFlowbite)
</script>

<template>
  <form @submit.prevent="login">
    <div class="mb-5">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
      <input type="email" v-model="loginInfo.email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
    </div>
    <div class="mb-5">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
      <div class="relative">
        <div v-if="loginInfo.password!=''" class="absolute inset-y-0 end-2 py-2">
          <button type="button" @click="showPassword=!showPassword">
            <svg v-if="!showPassword" class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
              <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
            <svg v-if="showPassword" class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="m4 15.6 3.055-3.056A4.913 4.913 0 0 1 7 12.012a5.006 5.006 0 0 1 5-5c.178.009.356.027.532.054l1.744-1.744A8.973 8.973 0 0 0 12 5.012c-5.388 0-10 5.336-10 7A6.49 6.49 0 0 0 4 15.6Z"/>
              <path d="m14.7 10.726 4.995-5.007A.998.998 0 0 0 18.99 4a1 1 0 0 0-.71.305l-4.995 5.007a2.98 2.98 0 0 0-.588-.21l-.035-.01a2.981 2.981 0 0 0-3.584 3.583c0 .012.008.022.01.033.05.204.12.402.211.59l-4.995 4.983a1 1 0 1 0 1.414 1.414l4.995-4.983c.189.091.386.162.59.211.011 0 .021.007.033.01a2.982 2.982 0 0 0 3.584-3.584c0-.012-.008-.023-.011-.035a3.05 3.05 0 0 0-.21-.588Z"/>
              <path d="m19.821 8.605-2.857 2.857a4.952 4.952 0 0 1-5.514 5.514l-1.785 1.785c.767.166 1.55.25 2.335.251 6.453 0 10-5.258 10-7 0-1.166-1.637-2.874-2.179-3.407Z"/>
            </svg>
          </button>
        </div>
      </div>
      <input :type="showPassword?'text':'password'" v-model="loginInfo.password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
      <div class=" flex justify-end">
        <button type="button" @click="redirectToForgotPasswordPage" class=" underline font-poppins font-normal text-normal-text text-appBlue">J'ai oublié mon mot de passe</button>
      </div>
    </div>
    <button type="submit" :disabled=" loginInfo.email=='' || loginInfo.password==''" :class="loginInfo.email=='' || loginInfo.password==''?'bg-blue-400':'bg-appBlue'" class="flex justify-center text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">
      <default-loader v-if="loading" :loading="loading"/>
      <span v-else >Se connecter</span>
    </button>
  </form>

</template>

<style scoped>

</style>
