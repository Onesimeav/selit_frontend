<script setup lang="ts">
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { useRoute } from 'vue-router'
import { nextTick, onMounted, ref } from 'vue'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import { initFlowbite, Modal, type ModalInterface } from 'flowbite'
import { useDashboardShopStore } from '@/stores/dashboard/shop'
import type { Shop } from '@/models/shop'
import { useDashboardProductStore } from '@/stores/dashboard/product'
import ShopProductTable from '@/components/dashboard/ShopProductTable.vue'
import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import ProductTable from '@/components/dashboard/ProductTable.vue'
import DefaultErrorToast from '@/components/utils/DefaultErrorToast.vue'
import DefaultSuccesToast from '@/components/utils/DefaultSuccesToast.vue'
import DefaultLoader from '@/components/utils/DefaultLoader.vue'

const shopStore = useDashboardShopStore();
const productStore = useDashboardProductStore();
const route = useRoute();

const loading = ref(false);
const loadingAddProduct = ref(false);
const errorMessage = ref<string>();
const showErrorToast = ref<boolean>(false);
const showSuccessMessage = ref<boolean>(false);
const successMessage = ref<string>();
const shop = ref<Shop>();
const products = ref<Page<Product>>()
const page = ref<number>(1);
const addProductModal = ref<ModalInterface>();
const shopProductsPage = ref<number>(1);
const selectedProducts = ref<Product[]>([]);
const searchWord = ref<string>();
const userProducts = ref<Page<Product>>();
const descriptionModal = ref<ModalInterface>()


const getShopDetails = async()=>{
  shop.value= await shopStore.getShop(String(route.params.subdomain));
  await getShopProducts();
}

const getShopProducts = async ()=>{
  if(shop.value){
    productStore.products=null;
    await productStore.getProducts(undefined,shop.value.id,page.value==1?page.value:undefined)
    await nextTick(() => {
      if (productStore.products) {
        products.value = productStore.products
      }
    })
  }else{
    console.log("Une erreur est survenue");
  }
}

const loadMore = async ()=>{
  page.value +=1;
  await getShopProducts();
}

const changeShopStatus= async ()=>{
  loading.value = true;
  showErrorToast.value = false;
  if (shop.value){
    if (await shopStore.publishShop(shop.value.id)){
      await getShopDetails();
      loading.value = false;
    }else{
      loading.value = false;
      errorMessage.value="Echec de l'opération";
      showErrorToast.value = true;
    }
  }else{
    loading.value = false;
    errorMessage.value="Une erreur est survenue";
    showErrorToast.value = true;
  }

}

const loadMoreUserProducts = async ()=>{
  shopProductsPage.value +=1;
  await getUserProducts();
}

const removeProductFromShop = (products:number[])=>{
  for (let i = 0; i < products.length; i++) {
    selectedProducts.value=selectedProducts.value.filter(product=>products[i]!=product.id)
  }
}

const searchProduct = async (term:string)=>{
  searchWord.value=term;
  await getUserProducts();
}

const resetFilter = async ()=>{
  searchWord.value=undefined;
  await getUserProducts();
}

const getUserProducts = async ()=>{
  await productStore.getProducts(searchWord.value,undefined,shopProductsPage.value>1?shopProductsPage.value:undefined)
  if(productStore.products){
      userProducts.value=productStore.products
      if (products.value && userProducts.value && userProducts.value.data){
        for (let i = 0; i < products.value.data.length; i++) {
         userProducts.value.data=userProducts.value.data.filter(product=>product.id!==products.value?.data[i].id)
        }
        userProducts.value.total -= products.value.total;
      }
    }

}

const addProducts = async ()=>{
  if (shop.value && selectedProducts.value && selectedProducts.value.length>0){
    loadingAddProduct.value = true;
    showErrorToast.value = false;
    showSuccessMessage.value=false;
    const productList:number[]=[];
    selectedProducts.value.forEach(product=>{
      productList.push(product.id);
    })
    if (await shopStore.addProducts(shop.value.id,productList)){
      selectedProducts.value = [];
      await getShopProducts();
      loadingAddProduct.value = false;
      successMessage.value = "Produits ajouté"
      showSuccessMessage.value = true;
    }else{
      loadingAddProduct.value = false;
      errorMessage.value='Identifiants incorrectes';
      showErrorToast.value = true;
    }
  }
}

const createModal = ()=>{
  const modal = document.getElementById('add-product-modal');
  const description = document.getElementById('default-modal')
  if(modal && description){
    descriptionModal.value = new Modal(description);
    addProductModal.value= new Modal(modal,
      {
        onShow:async () => {
          await getUserProducts()
        }
      }
    );
  }else{
    console.log("Une erreur s'est produite, veuillez recherger la page");
  }
}


onMounted(async()=>{
  await getShopDetails();
  initFlowbite();
  createModal();
});

</script>

<template>
  <default-succes-toast :message="successMessage" :show="showSuccessMessage" />
  <default-error-toast :message="errorMessage" :show="showErrorToast"/>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Détails de la boutique</p>
      </div>
    </div>
    <div v-if="shop">
      <div class="flex justify-end items-center mb-5">
        <button @click="changeShopStatus()" v-if="shop.publish" type="button" class="bg-green-500 rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">
          <default-loader v-if="loading" :loading="loading"/>
          <span v-else >Désactiver</span>
        </button>
        <button @click="changeShopStatus()" v-else type="button" class="bg-appGray rounded-lg font-semibold font-poppins text-heading-3 text-white px-4 py-1">
          <default-loader v-if="loading" :loading="loading"/>
          <span v-else >Activer</span>
        </button>
      </div>
      <div class="relative py-2.5 bg-center bg-cover h-full w-full rounded-xl my-5 px-6" :style="{backgroundImage:`url(${shop.banner})` } ">
        <div id="navbarChild" class="container">
          <div class="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
          <div class="relative z-10 flex justify-end px-2.5"></div>
          <div class=" relative z-10 grid grid-cols-8 items-center ">
            <div class=" col-span-7 m-4 pl-16 flex flex-col items-center">
              <img class=" w-32 h-32 rounded-full opacity-100" v-if="shop" :src="shop.logo" alt="Shop Logo">
              <h1 class="font-sora font-extra-bold text-4xl text-white ">{{shop.name}}</h1>
            </div>
            <!-- Modal toggle -->
            <div v-if="descriptionModal" class="col-span-1 flex flex-col items-start justify-start h-full">
              <button @click="descriptionModal.show()" class="text-white bg-white/60 hover:bg-white/80 focus:outline-none font-medium rounded-full p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                <svg class="w-6 h-6 text-black dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="5" d="M6 12h.01m6 0h.01m5.99 0h.01"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center mb-3">
        <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>
        <button v-if="addProductModal" type="button" @click="addProductModal.show(); console.log(userProducts)" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
          <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Ajouter
        </button>
      </div>
      <shop-product-table v-if="products" :loading="loadingAddProduct" :products="products" :products-to-add="selectedProducts" @remove-products="productList => removeProductFromShop(productList)" @add-products="addProducts()" @load-more="loadMore()"/>
    </div>
  </div>

  <!-- Main modal -->
  <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div v-if="shop && descriptionModal" class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Informations
          </h3>
          <button @click="descriptionModal.hide()" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {{shop.description}}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Add product modal  -->
  <div id="add-product-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div v-if="addProductModal && userProducts" class="relative p-4 w-full max-w-4xl max-h-full">
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
          <product-table :products="userProducts" :category-page="true" @product-list="list => {selectedProducts=list}" @load-more="loadMoreUserProducts"/>
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


</template>

<style scoped>

</style>
