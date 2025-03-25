<script setup lang="ts">
import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import CreateButton from '@/components/dashboard/CreateButton.vue'
import ShopFilterComponent from '@/components/dashboard/ShopFilterComponent.vue'
import DeleteElementModal from '@/components/dashboard/DeleteElementModal.vue'
import { onMounted, ref, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import { useUserStore } from '@/stores/dashboard/user'
import { useRouter } from 'vue-router'
import type { Page } from '@/models/page'
import { useDashboardPromotionStore } from '@/stores/dashboard/promotion'
import type { Promotion } from '@/models/promotion'
import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'
import DefaultSuccesToast from '@/components/utils/DefaultSuccesToast.vue'

const userStore = useUserStore();
const promotionStore = useDashboardPromotionStore();
const router = useRouter();

const promotions = ref<Page<Promotion>>();
const page = ref(1);
const actualShop = ref<number>();
const searchWord = ref<string>();
const promotionToDelete = ref<number>();
const loading = ref(false);
const errorMessage = ref("");
const showErrorMessage = ref(false);
const successMessage = ref("");
const showSuccessMessage = ref(false);


const getPromotions = async ()=>{
  while (userStore.loading){
    await new Promise(resolve => {setTimeout(resolve,100)})
  }
  if (page.value==1){
    await promotionStore.getPromotions(searchWord.value,actualShop.value);
  }else{
    await promotionStore.getPromotions(searchWord.value,actualShop.value,page.value)
  }
}

const filterCategoriesByShop = async (shopId?:number)=>{
  if (shopId){
    actualShop.value=shopId;
  }else{
    actualShop.value=undefined;
  }
  await getPromotions();
}

const filterCategoriesBySearchTerm = async (searchTerm?:string) =>{
  if (searchTerm){
    searchWord.value = searchTerm;
  }else {
    searchWord.value = undefined;
  }
  await getPromotions();
}

const loadMore = async () => {
  page.value += 1
  await getPromotions();
};

const deleteCategory = async (promotionId:number)=>{
  loading.value = true;
  showErrorMessage.value = false;
  showSuccessMessage.value = false;
  if (await promotionStore.deletePromotion(promotionId)){
    loading.value=false;
    successMessage.value = "Promotion supprimée";
    showSuccessMessage.value = true;
    await getPromotions();
  }else{
    loading.value = false;
    errorMessage.value="Echec de l'opération"
    showErrorMessage.value = true;
  }
}

const redirectToPromotionDetails =(promotionId:number)=>{
  router.push(`promotion/${promotionId}`);
}

const redirectToEditPromotion = (promotionId:number)=>{
  router.push(`promotion/update/${promotionId}`);
}


onMounted(()=>{
  getPromotions();
  if(promotionStore.promotions){
    promotions.value=promotionStore.promotions;
  }
  initFlowbite();
})

watch(()=>promotionStore.promotions,(newPromotions)=>{
  if(newPromotions){
    promotions.value=newPromotions
  }
})
</script>

<template>
  <default-error-toast :message="errorMessage" :show="showErrorMessage" />
  <default-succes-toast :message="successMessage" :show="showSuccessMessage" />
  <div class="p-4 mt-24 sm:ml-64">
    <div class="flex justify-between w-full">
      <search-bar-component @reset-search-filter="filterCategoriesBySearchTerm" @search="searchTerm => filterCategoriesBySearchTerm(searchTerm)"/>
      <div class="flex items-center justify-between">
        <create-button route-name="create-promotion"/>
        <shop-filter-component @reset-shop-filter="filterCategoriesByShop" @change-shop="shopId => filterCategoriesByShop(shopId)"/>
      </div>
    </div>
    <div v-if="promotions && promotions.data.length>0">
      <div  class="flex flex-wrap">
        <div v-for="promotion in promotions.data" :key="promotion.id">
          <div class="border-none rounded-lg shadow shadow-gray-300 hover:shadow-md mx-4 my-8 p-4">
            <button @click="redirectToPromotionDetails(promotion.id)" class="my-4">
              <span class="font-poppins font-semibold text-heading-3 text-left">{{promotion.name}}</span>
            </button>
            <div class="flex items-center">
              <button @click="redirectToEditPromotion(promotion.id)" class="border-none rounded-md bg-appGray text-appBlue  hover:bg-appBlue hover:text-white justify-center px-2 mr-2">
                <p class="font-poppins font-semibold text-normal-text ">Modifier</p>
              </button>
              <button @click="promotionToDelete=promotion.id" class="border-none rounded-md bg-red-300 hover:bg-red-600 hover:text-white justify-center px-2">
                <p class="font-poppins font-semibold text-normal-text">Supprimer</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center ">
        <button @click="loadMore" v-if="promotions.total>promotions.per_page"  class=" col-span-2 border-2 rounded-full px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
      </div>
      <DeleteElementModal :loading="loading" element-name="cette catégorie" :element-id="promotionToDelete" @delete-element="elementToDelete => deleteCategory(elementToDelete)" @hide-modal="promotionToDelete=undefined"  />
    </div>
    <div v-else class=" w-full justify-center items-center">
      <p class="font-poppins font-normal text-normal-text text-appGray">Aucune catégories disponible</p>
    </div>
  </div>
</template>

<style scoped>

</style>
