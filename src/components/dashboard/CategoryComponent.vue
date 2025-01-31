<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
  import type { Page } from '@/models/page'
  import type { Category } from '@/models/category'
  import { useUserStore } from '@/stores/dashboard/user'
  import { useDashboardCategoryStore } from '@/stores/dashboard/category'
  import ShopFilterComponent from '@/components/dashboard/ShopFilterComponent.vue'
  import CreateButton from '@/components/dashboard/CreateButton.vue'
import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import DeleteElementModal from '@/components/dashboard/DeleteElementModal.vue'
import { useRouter } from 'vue-router'
import { initFlowbite } from 'flowbite'

  const userStore = useUserStore();
  const categoryStore = useDashboardCategoryStore();
  const router = useRouter();

  const categories = ref<Page<Category>>();
  const page = ref(1);
  const actualShop = ref<number>();
  const searchWord = ref<string>();
  const categoryToDelete = ref<number>()

  const getCategories = async ()=>{
    while (userStore.loading){
      await new Promise(resolve => {setTimeout(resolve,100)})
    }
    if (page.value==1){
      await categoryStore.getCategories(actualShop.value,searchWord.value);
    }else{
      await categoryStore.getCategories(actualShop.value,searchWord.value,page.value)
    }
  }

  const filterCategoriesByShop = async (shopId?:number)=>{
    if (shopId){
      actualShop.value=shopId;
    }else{
      actualShop.value=undefined;
    }
    await getCategories();
  }

  const filterCategoriesBySearchTerm = async (searchTerm?:string) =>{
    if (searchTerm){
      searchWord.value = searchTerm;
    }else {
      searchWord.value = undefined;
    }
    await getCategories();
  }

  const loadMore = async () => {
    page.value += 1
    await getCategories();
  };

  const deleteCategory = async (categoryId:number)=>{
    if (await categoryStore.deleteCategory(categoryId)){
      console.log("Catégorie supprimée");
      await getCategories();
    }else{
      console.log("Echec de l'opération");
    }
  }

  const redirectToCategoryDetails =(categoryId:number)=>{
    router.push(`category/${categoryId}`);
  }

  const redirectToEditCategory = (categoryId:number)=>{
    router.push(`category/update/${categoryId}`);
  }


  onMounted(()=>{
    getCategories();
    if(categoryStore.categories){
      categories.value=categoryStore.categories;
    }
    initFlowbite();
  })

  watch(()=>categoryStore.categories,(newCategories)=>{
    if(newCategories){
      categories.value=newCategories
    }
  })
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div v-if="categories">
      <div class="flex justify-between w-full">
        <search-bar-component @reset-search-filter="filterCategoriesBySearchTerm" @search="searchTerm => filterCategoriesBySearchTerm(searchTerm)"/>
        <div class="flex items-center justify-between">
          <create-button route-name="create-category"/>
          <shop-filter-component @reset-shop-filter="filterCategoriesByShop" @change-shop="shopId => filterCategoriesByShop(shopId)"/>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div v-for="category in categories.data" :key="category.id">
          <div class="border-none rounded-lg shadow shadow-gray-300 hover:shadow-md mx-4 my-8 p-4">
            <button @click="redirectToCategoryDetails(category.id)" class="my-4">
              <span class="font-poppins font-semibold text-heading-3 text-left">{{category.name}}</span>
            </button>
            <div class="flex items-center">
              <button @click="redirectToEditCategory(category.id)" class="border-none rounded-md bg-appGray text-appBlue  hover:bg-appBlue hover:text-white justify-center px-2 mr-2">
                <p class="font-poppins font-semibold text-normal-text ">Modifier</p>
              </button>
              <button @click="categoryToDelete=category.id" class="border-none rounded-md bg-red-300 hover:bg-red-600 hover:text-white justify-center px-2">
                <p class="font-poppins font-semibold text-normal-text">Supprimer</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center ">
        <button @click="loadMore" v-if="categories.total>categories.per_page"  class=" col-span-2 border-2 rounded-full px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
      </div>
      <DeleteElementModal element-name="cette catégorie" :element-id="categoryToDelete" @delete-element="elementToDelete => deleteCategory(elementToDelete)" @hide-modal="categoryToDelete=undefined"  />
    </div>
    <div v-else class=" w-full justify-center items-center">
      <p class="font-poppins font-normal text-normal-text text-appGray">Aucune catégories disponible</p>
    </div>
  </div>

</template>

<style scoped>

</style>
