<script setup lang="ts">
import { onMounted, ref } from 'vue'
  import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'

  const step = ref(1);
  const signUpInfo = ref({
    email:'',
    username:'',
    password:'',
    confirmPassword:'',
  })
  const showPassword = ref(false);
  const loading = ref(false);
  const errorMessage = ref<string>();
const showErrorToast = ref<boolean>(false);
  const userStore = useUserStore();
  const router = useRouter();

  const checkSignUpValues = ()=>{
    return signUpInfo.value.email!=='' && signUpInfo.value.username!=='' && signUpInfo.value.password!=='' && signUpInfo.value.confirmPassword!=='' && signUpInfo.value.password==signUpInfo.value.confirmPassword ;
  }

  const createAccount = async ()=>{
    loading.value = true;
    showErrorToast.value = false;
    if (checkSignUpValues()){
      if (await userStore.createUserAccount(signUpInfo.value.username,signUpInfo.value.email,signUpInfo.value.password)){
        loading.value = false;
        await router.push('/verify-user');
      }else{
        loading.value = false;
        errorMessage.value='Erreur lors de la création du compte';
        showErrorToast.value = true;
      }
    }else{
      loading.value = false;
      errorMessage.value='Mot des passes différents ou informations manquantes';
      showErrorToast.value = true;
    }
  }

  onMounted(initFlowbite);
</script>

<template>
  <default-error-toast :message="errorMessage" :show="showErrorToast"/>
  <ol class="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base m-6">
    <li :class="step!=1 && signUpInfo.email!='' ?'text-appBlue':''" class="flex md:w-full items-center font-poppins dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
       <button type="button" @click="step=1" >
          <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            <svg v-if="signUpInfo.email!=''" class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span v-if="signUpInfo.email==''" class="me-2">1</span>
            Addresse  <span class="hidden sm:inline-flex sm:ms-2">email</span>
        </span>
       </button>

    </li>
    <li :class="step!=2 && signUpInfo.username!='' ?'text-appBlue':''" class="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
      <button type="button" @click="step=2">
        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
          <svg v-if="signUpInfo.username!=''" class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
          <span v-if=" signUpInfo.username==''" class="me-2">2</span>
            Nom <span class="hidden sm:inline-flex sm:ms-2">d'utilisateur</span>
        </span>
      </button>

    </li>
    <li :class="signUpInfo.password!='' && signUpInfo.confirmPassword!='' && signUpInfo.confirmPassword==signUpInfo.password?'text-appBlue':''" class="flex items-center">
      <button type="button" @click="step=3">
        <span class="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
          <svg v-if="signUpInfo.password!='' && signUpInfo.confirmPassword!='' && signUpInfo.confirmPassword==signUpInfo.password" class="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
          </svg>

          <span v-if="signUpInfo.password=='' && signUpInfo.confirmPassword==''" class="me-2">3</span>
            Mot <span class="hidden sm:inline-flex sm:ms-2">de</span> <span class="hidden sm:inline-flex sm:ms-2">passe</span>
        </span>
      </button>

    </li>
  </ol>



  <form v-if="step==1" class="w-full" @submit.prevent="step=2">
    <div class="mb-5">
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
      <input type="email" id="email"  v-model="signUpInfo.email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
    </div>
    <button type="submit" :disabled=" signUpInfo.email==''" :class="signUpInfo.email=='' ?'bg-blue-400':'bg-appBlue'" class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">Suivant</button>
  </form>

  <form v-if="step==2" class="w-full" @submit.prevent="step=3">
    <div class="mb-5">
      <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom d'utilisateur</label>
      <input type="text" id="username" v-model="signUpInfo.username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="VendeurDuBled" required />
    </div>
    <button type="submit" :disabled=" signUpInfo.email==''|| signUpInfo.username==''" :class="signUpInfo.email=='' || signUpInfo.username=='' ?'bg-blue-400':'bg-appBlue'" class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">Suivant</button>
  </form>

  <form v-if="step==3" class="w-full" @submit.prevent="createAccount">
    <div class="mb-5">
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
      <div class="relative">
        <div v-if="signUpInfo.password!=''" class="absolute inset-y-0 end-2 py-2">
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
      <input :type="showPassword?'text':'password'" v-model="signUpInfo.password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
    </div>

    <div class="mb-5">
      <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmez votre mot de passe</label>
      <div class="relative">
        <div v-if="signUpInfo.confirmPassword!=''" class="absolute inset-y-0 end-2 py-2">
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
      <input :type="showPassword?'text':'password'" v-model="signUpInfo.confirmPassword" id="confirmPassword" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
    </div>

    <button
      type="submit"
      :disabled=" signUpInfo.email==''|| signUpInfo.username=='' || signUpInfo.password=='' || signUpInfo.confirmPassword==''"
      :class="signUpInfo.email=='' || signUpInfo.username=='' || signUpInfo.password=='' || signUpInfo.confirmPassword=='' ?'bg-blue-400':'bg-appBlue'"
      class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full"
    >
      Créer mon compte
    </button>

  </form>



</template>

<style scoped>

</style>
