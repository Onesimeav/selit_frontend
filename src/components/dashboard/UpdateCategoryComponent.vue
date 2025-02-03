<script setup lang="ts">

  import { useDashboardCategoryStore } from '@/stores/dashboard/category'
  import { onMounted, ref, watch } from 'vue'
  import type { Category } from '@/models/category'
  import { useRoute, useRouter } from 'vue-router'
  import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
  import ProductTable from '@/components/dashboard/ProductTable.vue'
  import CategoryProductTable from '@/components/dashboard/CategoryProductTable.vue'
  import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
  import { initFlowbite, Modal, type ModalInterface } from 'flowbite'
  import type { Page } from '@/models/page'
  import type { Product } from '@/models/product'
  import { useDashboardProductStore } from '@/stores/dashboard/product'

  const categoryStore = useDashboardCategoryStore();
  const route = useRoute();
  const router = useRouter();
  const productStore = useDashboardProductStore();

  const category = ref<Category>();
  const categoryProductsPage = ref<number>(1);
  const shopProductsPage = ref<number>(1)
  const categoryName = ref<string>();
  const addProductModal = ref<ModalInterface>();
  const shopProducts = ref<Page<Product>>();
  const selectedProducts = ref<Product[]>([]);
  const searchWord = ref<string>();
  const categoryShop = ref<number>();

  const getCategory = async ()=>{
    category.value = await categoryStore.getCategory(Number(route.params.id));
    await getCategoryProducts();
    categoryName.value = category.value.name;
  }

  const getCategoryProducts =  async ()=>{
    if (category.value){
      category.value.products= await categoryStore.getCategoryProducts(Number(route.params.id),categoryProductsPage.value?categoryProductsPage.value:undefined);
    }else{
      console.log("Une erreur est survenue");
    }
  }

  const loadMoreCategoryProducts = async ()=>{
    categoryProductsPage.value +=1;
    await getCategoryProducts();
  }

  const loadMoreShopProducts = async ()=>{
    shopProductsPage.value +=1;
    await getCategoryProducts();
  }

  const removeProductFromCategory = (products:number[])=>{
    for (let i = 0; i < products.length; i++) {
      selectedProducts.value=selectedProducts.value.filter(product=>products[i]!=product.id)
    }
  }

  const searchProduct = async (term:string)=>{
    searchWord.value=term;
    await getShopProducts()
  }

  const resetFilter = async ()=>{
    searchWord.value=undefined;
    await getShopProducts();
  }

  const getCategoryShop = ()=>{
    if (category.value){
      if (category.value.products && category.value.products.data.length>0){
        categoryShop.value=category.value.products.data[0].shop_id;
      }
    }else {
      console.log("Une erreur est survenue");
    }
  }

  const getShopProducts = async ()=>{
    await productStore.getProducts(searchWord.value,categoryShop.value,shopProductsPage.value>1?shopProductsPage.value:undefined)
    if(productStore.products){
      shopProducts.value=productStore.products
      if (category.value && category.value.products && shopProducts.value && shopProducts.value.data){
        for (let i = 0; i < category.value.products.data.length; i++) {
         shopProducts.value.data=shopProducts.value.data.filter(product=>product.id!==category.value?.products?.data[i].id)
        }
        shopProducts.value.total -= category.value.products.total;
      }
    }
  }

  const createModal = ()=>{
    const modal = document.getElementById('add-product-modal');
    if(modal){
      addProductModal.value= new Modal(modal,
        {
          onShow:async () => {
            await getShopProducts()
          }
        }
      );
    }else{
      console.log("Une erreur s'est produite, veuillez recherger la page");
    }
  }

  const verifyCategoryUpdateValues = () =>{
    return category.value!=undefined && categoryName.value!=undefined && categoryName.value!=category.value.name || (selectedProducts.value && selectedProducts.value.length>0)
  }

  const updateCategory = async ()=>{
    if (verifyCategoryUpdateValues() && categoryName.value){
      if (await categoryStore.updateCategory(Number(route.params.id),categoryName.value)){
        if (selectedProducts.value && selectedProducts.value.length>0){
          const productsIds:number[] = [];
          selectedProducts.value.forEach(product=>{
            productsIds.push(product.id);
          });
          if (await categoryStore.addProductToCategory(Number(route.params.id),productsIds)){
            console.log("Opération réussi");
          }else{
            console.log("Echec de l'opération");
          }
        }
        console.log("Opération réussi");
        await router.push(`/category/${route.params.id}`);
      }else {
        console.log("Echec de l'opération");
      }
    }
  }

  onMounted(async ()=>{
    await getCategory();
    getCategoryShop();
    initFlowbite();
    createModal();
  })

  watch(()=>productStore.products,(newProducts)=>{
    if(newProducts && newProducts!=shopProducts.value){
      shopProducts.value = newProducts
      if (category.value && category.value.products && shopProducts.value && shopProducts.value.data){
        for (let i = 0; i < category.value.products.data.length; i++) {
          shopProducts.value.data=shopProducts.value.data.filter(product=>product.id!==category.value?.products?.data[i].id)
        }
        shopProducts.value.total -= category.value.products.total;
      }
    }
  })

</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Modifier la catégorie</p>
      </div>
    </div>

    <div v-if="category">
      <form class="w-full" @submit.prevent="updateCategory()" >
        <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Détails de la catégorie</p>
        <div class="col-span-3 mx-4 mb-8">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
          <input type="text" id="name" v-model="categoryName" class="w-full lg:w-2/5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="La paire de futur" required />
        </div>
        <div class="flex items-center mb-3">
          <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>
          <button v-if="addProductModal" type="button" @click="addProductModal.show()" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
            <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
            </svg>
            Ajouter
          </button>
        </div>
        <div class="mb-5">
          <category-product-table :products="selectedProducts" @remove-products="productList => removeProductFromCategory(productList)"/>
        </div>
        <product-table v-if="category.products && category.products.data && category.products.data.length>0" :products="category.products" :category-id="category.id" :category-detail-page="true" @load-more="loadMoreCategoryProducts()" @product-removed="getCategoryProducts()"/>
        <button type="submit" :disabled="!verifyCategoryUpdateValues()"  :class="verifyCategoryUpdateValues()?'bg-appBlue':'bg-blue-400'" class=" self-center w-1/5 border-none font-poppins font-medium text-heading-3 text-white rounded-lg px-2 py-2 m-8 hover:border-none ">Sauvegarder</button>
      </form>
      <!-- Add product modal  -->
      <div id="add-product-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div v-if="addProductModal && shopProducts" class="relative p-4 w-full max-w-4xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 class="text-xl font-medium text-gray-900 dark:text-white">
                Ajouter des produits
              </h3>
              <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="addProductModal.hide()">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
              <search-bar-component @search="searchTerm => {searchProduct(searchTerm)}" @reset-search-filter="resetFilter()"/>
              <div class="font-normal font-poppins text-normal-text px-4">
                Produits sélectionnées:
                <span v-if="selectedProducts" class="text-appBlue">
                {{selectedProducts.length}}
              </span>
              </div>
              <product-table :products="shopProducts" :category-page="true" @product-list="list => {selectedProducts=list}" @load-more="loadMoreShopProducts()"/>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center justify-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
              <button @click="addProductModal.hide()" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Ajouter
                <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-white  bg-blue-400 rounded-full">
               {{selectedProducts.length}}
              </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
