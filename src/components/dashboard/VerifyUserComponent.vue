<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/dashboard/user'

  const code = ref('');
  const router = useRouter();
  const userStore = useUserStore();
  const verifyAccount= async ()=>{
    if (code.value!==''){
      if (await userStore.verifyUserAccount(code.value)){
        router.push('/');
      }else{
        console.log("Une erreur s'est produite");
      }
    }else{
      console.log('Entrez le code de vérification')
    }
  }

  const resendCode = async ()=>{
    if (await userStore.resendVerificationCode()){
      console.log('Code envoyé');
    }else{
      console.log("Une erreur s'est produite");
    }
  }
</script>

<template>
  <div class="flex items-center justify-center self-center">
    <div class="flex flex-col items-center" >
      <img src="@/assets/selit-short-logo.png" class="h-[190px]" >
      <p class="font-poppins font-medium text-heading-1">Vérification d'addresse mail </p>
      <form class="w-full" @submit.prevent="verifyAccount">
        <div class="mb-5">
          <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code de vérification</label>
          <input type="text" v-model="code" id="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="XXXXX" required />
          <div class=" flex justify-end">
            <button type="button" @click="resendCode" class=" underline font-poppins font-normal text-normal-text text-appBlue">Renvoyer le code</button>
          </div>
        </div>
        <button type="submit" :disabled="code==''" :class="code==''?'bg-blue-400':'bg-appBlue'" class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">Vérification</button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
