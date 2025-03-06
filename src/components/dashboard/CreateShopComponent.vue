<script setup lang="ts">
  import { useDashboardShopStore } from '@/stores/dashboard/shop'
  import { useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import { initFlowbite } from 'flowbite'
  import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
  import type { CreateShop } from '@/requests/create-shop'

  const shopStore = useDashboardShopStore();
  const router = useRouter();

  const shopDetails = ref<{
    name:string,
    description:string,
    subdomain:string,
    banner : File|null,
    logo: File|null,
  }>({
    name:"",
    description:"",
    subdomain:"",
    banner:null,
    logo:null,
  })

  const addBanner = ()=>{
    const banner = document.getElementById('banner') as HTMLInputElement;
    if (banner){
      const file = banner.files;
      if (file && file.length>0 && file[0].type.split('/')[0]==='image'){
        shopDetails.value.banner=file[0];
      }
    }
  }
  const addLogo = ()=>{
    const logo = document.getElementById('logo') as HTMLInputElement;
    if (logo){
      const file = logo.files;
      if (file && file.length>0 && file[0].type.split('/')[0]==='image'){
        shopDetails.value.logo=file[0];
      }
    }
  }

  const verifyCreateShopFormValues = ()=>{
    return shopDetails.value.name!=="" && shopDetails.value.description!=="" && shopDetails.value.subdomain!=="" && shopDetails.value.banner!==null && shopDetails.value.logo!==null;
  }

  const createShop =async ()=>{
   if (verifyCreateShopFormValues() && shopDetails.value.banner!==null && shopDetails.value.logo!==null){
     const query:CreateShop = {
       name:shopDetails.value.name,
       description:shopDetails.value.description,
       subdomain:shopDetails.value.subdomain,
       banner:shopDetails.value.banner,
       logo:shopDetails.value.logo,
       productType:'Physic',
     }
     if (await shopStore.createShop(query)){
       console.log("Opération réussie");
       await router.push({name:'shop-list'});
     }else{
       console.log("Echec de l'opération");
     }
   }
  }

  onMounted(initFlowbite)

</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Créer une boutique</p>
      </div>
    </div>
    <form class="w-full" @submit.prevent="createShop" >
      <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Détails de la boutique</p>
      <div class="grid grid-cols-8 mb-8 justify-around">
        <div class="col-span-3 mx-4">
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
            <input type="text" id="name" v-model="shopDetails.name" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="La paire de futur" required />
        </div>
        <div class="col-span-3 mx-4">
          <div>
            <label for="duration" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sous-domaine</label>
            <input type="text" v-model="shopDetails.subdomain" id="duration" class="w-full lg:w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="monsousdomaine" required />
          </div>
          <p class="font-light font-poppins italic text-normal-text text-appGray ">(L'url à laquelle sera disponible votre boutique : sousdomine.selit.store)</p>
        </div>
      </div>

      <div class="mb-5">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea id="description" v-model="shopDetails.description" rows="4" class="block p-2.5 w-full lg:w-3/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Description de la boutique..."></textarea>
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="banner">Bannière de la boutique</label>
        <input @change="addBanner()" class="block w-full lg:w-2/3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="banner" type="file" required>
      </div>
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="logo">Logo de la boutique</label>
        <input @change="addLogo()" class="block w-full lg:w-2/3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="logo" type="file" required>
      </div>

      <button type="submit" :disabled="!verifyCreateShopFormValues()"  :class="verifyCreateShopFormValues()?'bg-appBlue':'bg-blue-400'" class=" self-center w-1/5 border-none font-poppins font-medium text-heading-3 text-white rounded-lg px-2 py-2 m-8 hover:border-none ">Créer la boutique</button>
    </form>
    </div>
</template>

<style scoped>

</style>
