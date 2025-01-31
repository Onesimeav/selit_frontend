<script setup lang="ts">
import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import CategoryProductTable from '@/components/dashboard/CategoryProductTable.vue'
import { onMounted, ref, watch } from 'vue'
import { initFlowbite, Modal, type ModalInterface } from 'flowbite'
import { useDashboardShopStore } from '@/stores/dashboard/shop'
import type { Shop } from '@/models/shop'
import { useUserStore } from '@/stores/dashboard/user'
import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
import ProductTable from '@/components/dashboard/ProductTable.vue'
import type { Page } from '@/models/page'
import type { Product } from '@/models/product'
import { useDashboardProductStore } from '@/stores/dashboard/product'
import { useDashboardCategoryStore } from '@/stores/dashboard/category'
import type { CreateCategory } from '@/requests/create-catgory'
import { useRouter } from 'vue-router'

const shopStore = useDashboardShopStore();
const userStore = useUserStore();
const productStore = useDashboardProductStore();
const categoryStore = useDashboardCategoryStore();
const router = useRouter();

const userShops = ref<Shop[]>();
const categoryDetails = ref<{
  name:string,
  shop:number|null,
}>({
  name:"",
  shop:null });
const addProductModal = ref<ModalInterface>();
const shopProducts = ref<Page<Product>>();
const selectedProducts = ref<Product[]>([]);
const searchWord = ref<string>();
const page = ref<number>(1);


const getUserShops = async ()=>{
  while (userStore.loading){
    await new Promise(resolve => {setTimeout(resolve,100)})
  }
  await shopStore.getUserShops();
  if (shopStore.shops){
    userShops.value=shopStore.shops;
    categoryDetails.value.shop = shopStore.shops[0].id;
  }
}

const getShopProducts = async ()=>{
  if(categoryDetails.value && categoryDetails.value.shop){
    await productStore.getProducts(searchWord.value,categoryDetails.value.shop,page.value!=1?page.value:undefined);
    if (productStore.products){
      shopProducts.value=productStore.products;
    }
  }else {
    console.log("Une erreur s'est produite, veuillez recherger la page");
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

const loadMoreProducts = async ()=>{
  page.value+=1;
  await getShopProducts();
}

const removeProductFromCategory = (products:number[])=>{
  for (let i = 0; i < products.length; i++) {
    selectedProducts.value=selectedProducts.value.filter(product=>products[i]!=product.id)
  }
}

const verifyCreateCategoryFormValues = ()=>{
  return categoryDetails.value.name!="" && categoryDetails.value.shop!=null ;
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

const createCategory =async ()=>{
  if (verifyCreateCategoryFormValues()){
    if(categoryDetails.value.shop){
      const query:CreateCategory = {
        name:categoryDetails.value.name,
        shop_id: categoryDetails.value.shop,
      }
      const category:number = await categoryStore.createCategory(query);

      if(category){
        if (selectedProducts.value.length>0){
          const products:number[]=[];
          for (let i = 0; i < selectedProducts.value.length; i++) {
            products.push(selectedProducts.value[i].id);
          }
          if (await categoryStore.addProductToCategory(category,products)){}else{
            return console.log("Echec de l'opération");
          }
        }
        await router.push({name:'category-list'});
      }else {
        return console.log("Echec de l'opération");
      }
    }
  }else{
    return console.log("Echec de l'opération");
  }
}

onMounted( async ()=>{
  initFlowbite();
   await getUserShops();
  createModal();
})

watch(()=>shopStore.shops,(newShops)=>{
  if (newShops && newShops!=userShops.value){
    userShops.value=newShops;
  }
})
watch(()=>productStore.products,(newProducts)=>{
  if(newProducts && newProducts!=shopProducts.value) shopProducts.value = newProducts
})
</script>

<template>
  <div v-if="userShops && userShops.length>0" class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Créer une catégorie</p>
      </div>
    </div>
    <form class="w-full" @submit.prevent="createCategory" >
      <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Détails de la catégorie</p>
      <div class="grid grid-cols-8 mb-8 justify-around">
        <div class="col-span-3 mx-4">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
          <input type="text" id="name" v-model="categoryDetails.name" class="w-full lg:w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="La paire de futur" required />
        </div>
        <div class="col-span-2 mx-4">
          <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Boutique</label>
          <select v-if="userShops.length==1" id="countries" v-model="categoryDetails.shop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected>{{userShops[0].name}}</option>
          </select>
          <select v-if="userShops.length>1" id="countries" v-model="categoryDetails.shop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option selected :value="userShops[0].id">{{userShops[0].name}}</option>
            <option v-for="shop in userShops.slice(1)" :key="shop.id" :value="shop.id">{{shop.name}}</option>
          </select>
        </div>
      </div>
      <div class="flex items-center mb-3">
        <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Produits</p>
        <button v-if="addProductModal" @click="addProductModal.show()" type="button"  class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
          <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
          </svg>
          Ajouter
        </button>
      </div>
      <category-product-table :products="selectedProducts" @remove-products="productList => removeProductFromCategory(productList)"/>
      <button type="submit" :disabled="!verifyCreateCategoryFormValues()"  :class="verifyCreateCategoryFormValues()?'bg-appBlue':'bg-blue-400'" class=" self-center w-1/5 border-none font-poppins font-medium text-heading-3 text-white rounded-lg px-2 py-2 m-8 hover:border-none ">Créer la catégorie</button>
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
            <product-table :products="shopProducts" :category-page="true" @product-list="list => {selectedProducts=list}" @load-more="loadMoreProducts"/>
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
</template>

<style scoped>

</style>
