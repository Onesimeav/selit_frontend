<script setup lang="ts">
  import type { Page } from '@/models/page'
  import type { Product } from '@/models/product'
  import { onMounted, ref } from 'vue'
  import { initFlowbite } from 'flowbite'

  const props = defineProps<{
    products: Page<Product>,
    productsToAdd ?: Product[],
  }>();
  const emit = defineEmits<{
    (event:'load-more'):void;
    (event:'remove-products',productList:number[]):number[];
    (event:'add-products'):void;
  }>();
  const showLoadMore = ref<boolean>();
  const selectedProducts = ref<number[]>([]);


  const loadMore = ()=>{
    if (showLoadMore.value){
      emit('load-more');
    }
  }
  const getProductTotal = () =>{
    if (props.products.per_page <props.products.total){
      showLoadMore.value=false
    }else {
      showLoadMore.value = false
    }
  }

  const allProductCheckbox = ()=>{
    if (props.productsToAdd){
      if(props.productsToAdd.length===selectedProducts.value.length){
        selectedProducts.value = [];
      }else{
        selectedProducts.value = [];
        for (let i = 0; i < props.productsToAdd.length; i++) {
          selectedProducts.value.push(props.productsToAdd[i].id);
        }
      }
    }
  }

  const productCheckbox=(index:number)=>{
    if (selectedProducts.value.find(productId=>productId==index)){
      selectedProducts.value= selectedProducts.value.filter(productId=>productId!=index);
    }else{
      selectedProducts.value.push(index)
    }
  }

  const removeProducts = ()=>{
    if (selectedProducts.value && selectedProducts.value.length>0){
      emit('remove-products',selectedProducts.value);
      selectedProducts.value=[];
    }
  }

  const removeSingleProduct = (productId:number)=>{
    selectedProducts.value = [];
    emit('remove-products', [productId]);
  }


  onMounted(()=>{
    getProductTotal();
    initFlowbite();
  });
</script>

<template>
  <!--List of product to add -->
  <div v-if="productsToAdd && productsToAdd.length>0" class="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
    <div class="relative justify-items-end end-6 ">
      <button type="button" @click="emit('add-products')" class=" flex justify-around items-center border-none bg-appBlue rounded-lg px-4 py-2 text-white font-poppins font-bold text-normal-text m-2">
        Ajouter
      </button>
    </div>
    <div v-if="selectedProducts.length>0" class="relative justify-items-end end-6 ">
      <button type="button" @click="removeProducts" class=" flex justify-around items-center border-none bg-red-700 rounded-lg px-4 py-2 text-white font-poppins font-bold text-normal-text m-2">
        Supprimer
        <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-red-800 bg-red-300 rounded-full">
          {{selectedProducts.length}}
        </span>
      </button>
    </div>
    <table v-if="productsToAdd.length>0" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input :checked="selectedProducts.length===productsToAdd.length" @click="allProductCheckbox" id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-all-search" class="sr-only">checkbox</label>
          </div>
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
      <tr v-for="product in productsToAdd" :key="product.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td class="w-4 p-4">
          <div class="flex items-center">
            <input :checked="selectedProducts.some(productId=>productId==product.id)" @click="productCheckbox(product.id)" id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
          </div>
        </td>
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {{product.name}}
        </th>
        <td class="px-6 py-4">
          {{ product.price }}
        </td>
        <td class="flex items-center px-6 py-4">
          <button @click="removeSingleProduct(product.id)" class="font-medium text-red-600 dark:text-red-500 hover:underline ms-3">Retirer</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <!--Shop products list-->
  <div v-if="products.data.length>0" class="relative font-poppins overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs font-bold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          Image
        </th>
        <th scope="col" class="px-6 py-3">
          Nom
        </th>
        <th scope="col" class="px-6 py-3">
          Prix
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(product,index) in products.data" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" >
        <th scope="row" class="px-6 py-4" >
          <div class=" border rounded-md h-24 w-24 bg-cover bg-center" :style="{backgroundImage:`url(${product.medias[0].url})`}" ></div>
        </th>
        <td class="px-6 py-4 font-medium text-gray-800">
          {{product.name}}
        </td>
        <td class="px-6 py-4">
          {{product.price}}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <div v-else class=" w-full justify-center items-center">
    <p class="font-poppins font-normal text-normal-text text-appGray">Aucune catégories disponible</p>
  </div>
  <div v-if="products.data.length>0" class="grid grid-cols-8 m-6">
    <div class="col-span-4"></div>
    <button v-if="showLoadMore" @click="loadMore" class=" col-span-2 border-2 rounded-full w-1/2 px-4 border-appGray font-poppins font-semibold text-heading-3 text-appBlue hover:text-white hover:bg-appBlue hover:border-appBlue">Voir plus</button>
    <p class="col-span-2 font-poppins font-semibold text-heading-3 ">Total: <span class="font-normal">{{products.total}}</span></p>
  </div>

</template>

<style scoped>

</style>
