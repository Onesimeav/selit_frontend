<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { initFlowbite, Modal, type ModalInterface } from 'flowbite'
  import type { Page } from '@/models/page'
  import type { Product } from '@/models/product'
import { useDashboardProductStore } from '@/stores/dashboard/product'
import { useRouter } from 'vue-router'
import { useDashboardCategoryStore } from '@/stores/dashboard/category'

  const props = defineProps<{
    products: Page<Product>,
    categoryPage?:false|boolean;
    categoryDetailPage?:false|boolean;
    categoryId?:number;
  }>();
  const emit = defineEmits<{
    (event:'load-more'):void;
    (event:'product-delete'):void;
    (event:'product-list',list:Product[]):Product[];
    (event:'product-removed'):void;
  }>();
  const showLoadMore = ref<boolean>();
  const selectedProducts=ref<number[]>([]);
  const productStore = useDashboardProductStore();
  const router = useRouter();
  const productList = ref<Product[]>([]);
  const categoryStore = useDashboardCategoryStore();
  const deleteProductModal = ref<ModalInterface>();

  const allProductCheckbox = ()=>{
   if(props.products.data.length===selectedProducts.value.length){
     selectedProducts.value = [];
     emit('product-list',[]);
   }else{
     selectedProducts.value = [];
     for (let i = 0; i < props.products.data.length; i++) {
       selectedProducts.value.push(props.products.data[i].id);
     }
     getProductList();
     emit('product-list',productList.value);
   }
  }

  const productCheckbox=(index:number)=>{
    if (selectedProducts.value.find(productId=>productId==index)){
      selectedProducts.value= selectedProducts.value.filter(productId=>productId!=index);
    }else{
      selectedProducts.value.push(index)
    }
    if (props.categoryPage){
      getProductList()
      emit('product-list',productList.value);
    }
  }

  const getProductList =()=>{
    if(props.products && selectedProducts.value){
      productList.value=[];
      selectedProducts.value.forEach(productId=>{
        const product = props.products.data.find(product=>product.id===productId);
        if(product) productList.value.push(product);
      })
    }
  }

  const deleteProducts= async ()=>{
    if (await productStore.deleteProducts(selectedProducts.value)){
      selectedProducts.value=[];
      emit('product-delete');
      console.log('Opération réussie');
      if (deleteProductModal.value){
        deleteProductModal.value.hide();
      }else {
        console.log("Une erreur est survenue, veuillez recharger la page")
      }
    }else {
      console.log("Echec de l'opération");
    }
  }

  const removeProduct = async ()=>{
    if (props.categoryDetailPage && props.categoryId){
      if (await categoryStore.removeProductFromCategory(props.categoryId,selectedProducts.value)){
        console.log("Opération réussi");
        emit('product-removed');
        if (deleteProductModal.value){
          deleteProductModal.value.hide();
        }else{
          console.log("Une erreur est survenue, veuillez recharger la page")
        }
      }else{
        console.log("Echec de l'opération");
      }
    }
  }

  const loadMore = ()=>{
    if (showLoadMore.value){
      emit('load-more');
    }
  }
  const getProductTotal = () =>{
    if (props.products.per_page <= props.products.total){
      showLoadMore.value=false
    }else {
      showLoadMore.value = false
    }
  }

  const redirectToUpdatePage =(index:number)=>{
    router.push({name:'update-product',params:{id:index}});
  }

  const createModal=()=>{
    const modal = document.getElementById('popup-modal');
    if (modal){
      deleteProductModal.value = new Modal(modal,{onHide:()=>{selectedProducts.value=[]}});
    }else {
      console.log("Une erreur est survenue,veuillez recharger la page");
    }
  }

  onMounted(()=>{
    getProductTotal();
    initFlowbite();
    createModal();
  });

</script>

<template>
    <div v-if="selectedProducts.length!=0 && (!categoryPage || categoryDetailPage) && deleteProductModal" class="relative justify-items-end end-6 ">
      <button type="button" @click="deleteProductModal.show()"  class=" flex justify-around items-center border-none bg-red-700 rounded-lg px-4 py-2 text-white font-poppins font-bold text-normal-text m-2">
        Supprimer
        <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-red-800 bg-red-300 rounded-full">
        {{selectedProducts.length}}
      </span>
      </button>
    </div>

  <div class="relative font-poppins overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs font-bold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input :checked="selectedProducts.length===products.data.length" @input="allProductCheckbox" id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-all-search" class="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col" class="px-6 py-3">
          Image
        </th>
        <th scope="col" class="px-6 py-3">
          Nom
        </th>
        <th scope="col" class="px-6 py-3">
          Prix
        </th>
        <th scope="col" class="px-6 py-3">
          Action
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(product,index) in products.data" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input :checked="selectedProducts.some(productId=>product.id===productId)" @input="productCheckbox(product.id)" id="checkbox-table-search-1"  type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
          </div>
        </td>
        <th scope="row" class="px-6 py-4" >
          <div class=" border rounded-md h-24 w-24 bg-cover bg-center" :style="{backgroundImage:`url(${product.medias[0].url})`}" ></div>
        </th>
        <td class="px-6 py-4 font-medium text-gray-800">
          {{product.name}}
        </td>
        <td class="px-6 py-4">
          {{product.price}}
        </td>
        <td class="px-6 py-8 flex justify-around">
          <div v-if="!categoryPage && !categoryDetailPage && deleteProductModal">
            <button type="button" @click="redirectToUpdatePage(product.id)" >
              <svg class="w-6 h-6 text-appBlue dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button @click="selectedProducts=[product.id];deleteProductModal.show()" >
              <svg class="w-6 h-6 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          <div v-if="categoryPage">
            <button @click="productCheckbox(product.id)" class="font-medium text-appBlue dark:text-red-500 hover:underline ms-3">Ajouter</button>
          </div>
          <div v-if="categoryDetailPage && deleteProductModal">
            <button @click="selectedProducts=[product.id]; deleteProductModal.show()"  class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Retirer</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div id="popup-modal" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div v-if="deleteProductModal" class="relative p-4 w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="deleteProductModal.hide()">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-4 md:p-5 text-center">
          <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Voulez vous vraiment supprimer
            {{selectedProducts.length <= 1 ? `ce produit` : `ces produits (${selectedProducts.length})`}} ?</h3>
          <button @click="categoryDetailPage?removeProduct():deleteProducts()" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
            Supprimer
          </button>
          <button @click="deleteProductModal.hide()" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Annuler</button>
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-8 m-6">
    <div class="col-span-4"></div>
    <button v-if="showLoadMore" @click="loadMore" class=" col-span-2 border-2 rounded-full w-1/2 px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
    <p class="col-span-2 font-poppins font-semibold text-heading-3 ">Total: <span class="font-normal">{{products.total}}</span></p>
  </div>

</template>

<style scoped>

</style>
