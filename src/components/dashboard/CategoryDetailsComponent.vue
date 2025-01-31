<script setup lang="ts">
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { useDashboardCategoryStore } from '@/stores/dashboard/category'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Category } from '@/models/category'
import ProductTable from '@/components/dashboard/ProductTable.vue'
import DeleteElementModal from '@/components/dashboard/DeleteElementModal.vue'

const categoryStore = useDashboardCategoryStore();
const route = useRoute();
const router = useRouter();

const category= ref<Category>();
const deleteCategoryId = ref<number>();
const page = ref<number>(1);

const getCategoryDetails = async()=>{
  category.value = await categoryStore.getCategory(Number(route.params.id));
  await getCategoryProduct();
}

const getCategoryProduct = async ()=>{
  if(category.value){
    category.value.products= await categoryStore.getCategoryProducts(Number(route.params.id),page.value>1?page.value:undefined);

  }else{
    console.log("Une erreur est survenue");
  }
}

const deleteCategory= async ()=>{
  if(deleteCategoryId.value){
    if (await categoryStore.deleteCategory(deleteCategoryId.value)){
      console.log('Catégorie supprimée');
      await router.push({name:'category-list'});
    }else{
      console.log("Echec de l'opération");
    }
  }else{
    console.log("Une erreur est survenue");
  }
}

const redirectToUpdateCategoryPage = ()=>{
  if (category.value){
    router.push(`/category/update/${category.value.id}`);
  }else {
    console.log("Une erreur est survenue");
  }

}

const loadMore = async ()=>{
  page.value +=1;
  await getCategoryProduct();
}


onMounted(()=>{
  getCategoryDetails();
})
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Détails de la catégorie</p>
      </div>
    </div>
    <div v-if="category">
      <div class="flex justify-end items-center mb-5">
        <button type="button" @click="redirectToUpdateCategoryPage()" class="bg-appBlue rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-2 mx-4">Modifier</button>
        <button type="button" @click="deleteCategoryId=category.id" class="bg-red-600 rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-2 mx-4">Supprimer</button>
      </div>
      <p class="font-bold font-poppins text-heading-2 text-gray-500 mb-5">Nom: <span class="text-black text-heading-3">{{category.name}}</span></p>
      <div class="flex items-center mb-3">
        <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>
        <button type="button" @click="redirectToUpdateCategoryPage()" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
          <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Ajouter
        </button>
      </div>
      <product-table v-if="category.products && category.products.data && category.products.data.length>0" :products="category.products" :category-id="category.id" :category-detail-page="true" @load-more="loadMore()" @product-removed="getCategoryProduct()"/>
      <div v-else class=" w-full justify-center items-center">
        <p class="font-poppins font-normal text-normal-text text-appGray">Aucun produit disponible</p>
      </div>
      <delete-element-modal element-name="cette catégorie" :element-id="deleteCategoryId" @delete-element="deleteCategory()" />
    </div>
  </div>
</template>

<style scoped>

</style>
