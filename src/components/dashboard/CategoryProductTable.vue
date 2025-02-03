<script setup lang="ts">

  import type { Product } from '@/models/product'
  import { ref } from 'vue'

  const props = defineProps<{
    products:Product[];
  }>();
  const emit = defineEmits<{
    (event:'remove-products',productList:number[]):number[];
  }>()

  const selectedProducts = ref<number[]>([]);

  const allProductCheckbox = ()=>{
    if(props.products.length===selectedProducts.value.length){
      selectedProducts.value = [];
    }else{
      selectedProducts.value = [];
      for (let i = 0; i < props.products.length; i++) {
        selectedProducts.value.push(props.products[i].id);
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

</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
    <div v-if="selectedProducts.length>0" class="relative justify-items-end end-6 ">
      <button type="button" @click="removeProducts" class=" flex justify-around items-center border-none bg-red-700 rounded-lg px-4 py-2 text-white font-poppins font-bold text-normal-text m-2">
        Supprimer
        <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-red-800 bg-red-300 rounded-full">
        {{selectedProducts.length}}
      </span>
      </button>
    </div>
    <table v-if="products.length>0" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input :checked="selectedProducts.length===products.length" @click="allProductCheckbox" id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
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
      <tr v-for="product in products" :key="product.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
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

</template>

<style scoped>

</style>
