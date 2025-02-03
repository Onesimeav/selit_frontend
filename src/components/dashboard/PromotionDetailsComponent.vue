<script setup lang="ts">

import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import ProductTable from '@/components/dashboard/ProductTable.vue'
import DeleteElementModal from '@/components/dashboard/DeleteElementModal.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { CopyClipboard, type CopyClipboardInterface, initFlowbite } from 'flowbite'
import type { Promotion } from '@/models/promotion'
import { useDashboardPromotionStore } from '@/stores/dashboard/promotion'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import type { CreatePromotion } from '@/requests/create-promotion'

const promotionStore = useDashboardPromotionStore();
const route = useRoute();
const router = useRouter();

const promotion= ref<Promotion>();
const products = ref<Page<Product>>()
const deletePromotionId = ref<number>();
const page = ref<number>(1);
const clipboard = ref<CopyClipboardInterface>();
const copied = ref<boolean>(false);

const getPromotionDetails = async()=>{
  promotion.value = await promotionStore.getPromotion(Number(route.params.id));
  await getPromotionProducts();
}

const getPromotionProducts = async ()=>{
  if(promotion.value){
    products.value= await promotionStore.getPromotionProducts(Number(route.params.id),page.value>1?page.value:undefined);

  }else{
    console.log("Une erreur est survenue");
  }
}

const deletePromotion= async ()=>{
  if(deletePromotionId.value){
    if (await promotionStore.deletePromotion(deletePromotionId.value)){
      console.log('Catégorie supprimée');
      await router.push({name:'category-list'});
    }else{
      console.log("Echec de l'opération");
    }
  }else{
    console.log("Une erreur est survenue");
  }
}

const redirectToUpdatePromotionPage = ()=>{
  if (promotion.value){
    router.push(`/promotion/update/${promotion.value.id}`);
  }else {
    console.log("Une erreur est survenue");
  }

}

const loadMore = async ()=>{
  page.value +=1;
  await getPromotionProducts();
}

const createCopyClipBoard = ()=>{
  const trigger = document.getElementById('copy-board-trigger');
  const elementToCopy = document.getElementById('text-to-copy') as HTMLInputElement;

  clipboard.value = new CopyClipboard(trigger,elementToCopy,{
    htmlEntities:false,
    onCopy:async()=>{
      copied.value = true;
      await  new Promise(resolve => {setTimeout(resolve,1000)});
      copied.value = false;
    }}
  );

}

const activateOrDesactivatePromotion = async ()=>{
  if (promotion.value){
    console.log(promotion.value.active);
    const query:CreatePromotion = {
      name:promotion.value.name,
      autoApply:promotion.value.autoApply,
      duration:promotion.value.duration,
      value:promotion.value.value,
      active:!promotion.value.active,
      shop_id:promotion.value.shop_id,
    }
    console.log(query.active)
    if (await promotionStore.updatePromotion(promotion.value.id,query)){
      console.log("Opération réussi");
      await getPromotionDetails();
    }else{
      console.log("Echec de l'opération");
    }
  }
}


onMounted(async()=>{
  await getPromotionDetails();
  initFlowbite();
  createCopyClipBoard();
})
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Détails de la promotion</p>
      </div>
    </div>
    <div v-if="promotion">
      <div class="flex justify-end items-center mb-5">
        <button type="button" @click="redirectToUpdatePromotionPage" class="bg-appBlue rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-2 mx-4">Modifier</button>
        <button type="button" @click="deletePromotionId = promotion.id" class="bg-red-600 rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-2 mx-4">Supprimer</button>
      </div>
      <div  class="grid grid-cols-8 mb-5 ">
        <p class="col-span-4 font-bold font-poppins text-heading-2 text-gray-500 mb-5">Nom: <span class="text-black text-heading-3">{{promotion.name}}</span></p>
        <div class="col-span-4 mx-4">
          <button @click="activateOrDesactivatePromotion()" v-if="promotion.active" type="button" class="bg-green-500 rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">Désactiver</button>
          <button @click="activateOrDesactivatePromotion()" v-else type="button" class="bg-appGray rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">Activer</button>
        </div>
      </div>
      <div  class="grid grid-cols-8 mb-5 ">
        <p class="col-span-4 font-bold font-poppins text-heading-2 text-gray-500 mb-5">Valeur: <span class="text-black text-heading-3">{{promotion.value}}</span></p>
        <p class="col-span-4 font-bold font-poppins text-heading-2 text-gray-500 mb-5">Durée: <span class="text-black text-heading-3">{{promotion.duration}}</span></p>
      </div>
      <!--Copy promo code-->
      <div class="grid grid-cols-8 mb-5 ">
        <div class="col-span-2">
          <p class="col-span-4 font-bold font-poppins text-heading-2 text-black mb-5">Code</p>
        </div>
        <div v-if="promotion.code" class="col-span-4">
          <div class="w-full">
            <div class="relative">
              <label for="text-to-copy" class="sr-only">Label</label>
              <input id="text-to-copy" type="text" class="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" :value="promotion.code" disabled readonly>
              <button id="copy-board-trigger" class="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border h-8">
            <span v-if="!copied" id="default-message">
                <span class="inline-flex items-center">
                    <svg class="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                    </svg>
                    <span class="text-xs font-semibold">Copier</span>
                </span>
            </span>
                <span v-if="copied" id="success-message" >
                <span class="inline-flex items-center">
                    <svg class="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                    </svg>
                    <span class="text-xs font-semibold text-blue-700 dark:text-blue-500">Copied</span>
                </span>
            </span>
              </button>
            </div>
          </div>
        </div>
        <p v-else class="font-normal font-poppins text-heading-3 italic col-span-5">La promotion est appliqué automatiquement aux produits</p>
      </div>
      <div class="flex items-center mb-3">
        <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>
        <button type="button" @click="redirectToUpdatePromotionPage()" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
          <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Ajouter
        </button>
      </div>
      <product-table v-if="products && products.data && products.data.length>0" :products="products" :category-id="promotion.id" :promotion-detail-page="true" @load-more="loadMore()" @product-removed="getPromotionProducts()"/>
      <div v-else class=" w-full justify-center items-center">
        <p class="font-poppins font-normal text-normal-text text-appGray">Aucun produit disponible</p>
      </div>
      <delete-element-modal element-name="cette promotion" :element-id="deletePromotionId" @delete-element="deletePromotion()" />
    </div>
  </div>
</template>

<style scoped>

</style>
