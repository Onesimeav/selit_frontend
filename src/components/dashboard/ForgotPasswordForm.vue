<script setup lang="ts">
import { onMounted, ref } from 'vue'
  import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import DefaultLoader from '@/components/utils/DefaultLoader.vue'
import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'

  const email = ref<string>('');
  const code = ref<number[]>([]);
  const password = ref<string>('');
  const passwordConfirm = ref<string>('');
  const step = ref(1);
  const userStore = useUserStore();
  const router = useRouter();

const loading = ref(false);
const errorMessage = ref<string>();
const showErrorToast = ref<boolean>(false);


const moveInputFocus = (event: Event): void => {
  // Narrow the event type to a KeyboardEvent
  const keyboardEvent = event as KeyboardEvent;
  const key = keyboardEvent.key;
  const target = keyboardEvent.target as HTMLInputElement;
  const currentValue = target.value;

  // Determine the current input ID
  const currentId = target.id;
  const index = parseInt(currentId.split('-')[1], 10);

  switch (index) {
    case 1:
      if (key === 'Backspace' && !currentValue) {
        break; // No action needed
      } else if (currentValue) {
        document.getElementById('code-2')?.focus();
      }
      break;
    case 2:
      if (key === 'Backspace' && !currentValue) {
        document.getElementById('code-1')?.focus();
      } else if (currentValue) {
        document.getElementById('code-3')?.focus();
      }
      break;
    case 3:
      if (key === 'Backspace' && !currentValue) {
        document.getElementById('code-2')?.focus();
      } else if (currentValue) {
        document.getElementById('code-4')?.focus();
      }
      break;
    case 4:
      if (key === 'Backspace' && !currentValue) {
        document.getElementById('code-3')?.focus();
      } else if (currentValue) {
        document.getElementById('code-5')?.focus();
      }
      break;
    case 5:
      if (key === 'Backspace' && !currentValue) {
        document.getElementById('code-4')?.focus();
      } else if (currentValue) {
        document.getElementById('code-6')?.focus();
      }
      break;
    case 6:
      if (key === 'Backspace' && !currentValue) {
        document.getElementById('code-5')?.focus();
      }
      break;
    default:
      break;
  }
};


const sendPasswordResetCode = async()=>{
    if (email.value!=''&& step.value==1){
      loading.value = true;
      showErrorToast.value = false;
      if (await userStore.forgotPassword(email.value)){
        loading.value = false;
        step.value=2;
      }else{
        loading.value = false;
        errorMessage.value="Echec de l'envoie du mail";
        showErrorToast.value = true;
      }
    }
  }

  const resetPassword = async () => {
    if (code.value.length==6 && passwordConfirm.value===password.value && step.value==3){
      loading.value = true;
      showErrorToast.value = false;

      const resetCodeToString = code.value.map(String);
      const resetCodeJoined = resetCodeToString.join('');
      const userResetCode = Number(resetCodeJoined);
      if(await userStore.resetPassword(userResetCode,password.value)){
        loading.value = false;
        await router.push('/login');
      }else{
        loading.value = false;
        errorMessage.value="Echec du changement de mode passe";
        showErrorToast.value = true;
      }
    }
  }

  onMounted(initFlowbite);
</script>

<template>
  <default-error-toast :message="errorMessage" :show="showErrorToast"/>
  <div v-if="step==1">
    <p class="font-rubik font-normal text-normal-text mb-3">Une code sera envoyer à votre addresse mail afin de vous permettre <br> de changer votre mot de passe</p>
    <form  @submit.prevent="sendPasswordResetCode">
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre adresse mail</label>
        <input type="email" v-model="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
      </div>
      <button type="submit" :disabled="email==''" :class="email==''?'bg-blue-400':'bg-appBlue'" class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">
        <default-loader v-if="loading" :loading="loading"/>
        <span v-else > Suivant</span>
      </button>
    </form>
  </div>


<div class="w-full" v-if="step==2">
  <p class="font-rubik font-normal text-normal-text mb-3">Entrez le code envoyer par mail</p>
  <form @submit.prevent="step=3" >
    <div class="flex mb-2 space-x-2 rtl:space-x-reverse">
      <div>
        <label for="code-1" class="sr-only">First code</label>
        <input type="text" maxlength="1" @input="moveInputFocus" @keydown="moveInputFocus" v-model="code[0]" data-focus-input-init data-focus-input-next="code-2" id="code-1" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
      <div>
        <label for="code-2" class="sr-only">Second code</label>
        <input type="text"  maxlength="1" @input="moveInputFocus" @keydown="moveInputFocus" v-model="code[1]" data-focus-input-init data-focus-input-prev="code-1" data-focus-input-next="code-3" id="code-2" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
      <div>
        <label for="code-3" class="sr-only">Third code</label>
        <input type="text" maxlength="1" @input="moveInputFocus" @keydown="moveInputFocus" v-model="code[2]" data-focus-input-init data-focus-input-prev="code-2" data-focus-input-next="code-4" id="code-3" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
      <div>
        <label for="code-4" class="sr-only">Fourth code</label>
        <input type="text" maxlength="1" @input="moveInputFocus" @keydown="moveInputFocus"  v-model="code[3]" data-focus-input-init data-focus-input-prev="code-3" data-focus-input-next="code-5" id="code-4" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
      <div>
        <label for="code-5" class="sr-only">Fifth code</label>
        <input type="text" maxlength="1" @input="moveInputFocus" @keydown="moveInputFocus" v-model="code[4]" data-focus-input-init data-focus-input-prev="code-4" data-focus-input-next="code-6" id="code-5" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
      <div>
        <label for="code-6" class="sr-only">Sixth code</label>
        <input type="text" maxlength="1" v-model="code[5]" @keydown="moveInputFocus" data-focus-input-init data-focus-input-prev="code-5" id="code-6" class="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
      </div>
    </div>
    <button type="submit" :disabled="code.length<6" :class="code.length<6?'bg-blue-400':'bg-appBlue'" class=" mt-2 text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">Suivant</button>
  </form>
</div>

  <div v-if="step==3">
    <p class="font-rubik font-normal text-normal-text mb-3">Entrez votre nouveau mode de passe</p>
    <form @submit.prevent="resetPassword">
      <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de passe</label>
        <input type="text" v-model="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
      </div>
      <div class="mb-5">
        <label for="repeat-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmez le mot de passe</label>
        <input type="text" v-model="passwordConfirm" id="repeat-password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
      </div>
      <button type="submit" :disabled="password=='' || passwordConfirm==''" :class="password=='' || passwordConfirm=='' ?'bg-blue-400':'bg-appBlue'" class="text-white font-poppins font-medium text-heading-2 border-none rounded-full px-14 py-2 w-full">Changer de mot de passe</button>
    </form>

  </div>




</template>

<style scoped>

</style>
