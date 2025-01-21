<script setup lang="ts">
  import { useDashboardProductStore } from '@/stores/dashboard/product'
  import { useUserStore } from '@/stores/dashboard/user'
  import { onMounted, ref, watch } from 'vue'
  import { initFlowbite } from 'flowbite'
  import ProductTable from '@/components/dashboard/ProductTable.vue'
  import type { Page } from '@/models/page'
  import type { Product } from '@/models/product'
  import ShopFilterComponent from '@/components/dashboard/ShopFilterComponent.vue'
  import SearchBarComponent from '@/components/dashboard/SearchBarComponent.vue'
  import CreateButton from '@/components/dashboard/CreateButton.vue'

  const productStore = useDashboardProductStore();
  const userStore = useUserStore();
  const products = ref<Page<Product>>();
  const page = ref(1);
  const actualShop = ref<number>();
  const searchWord = ref<string>();

  const getProducts = async ()=>{
    while (userStore.loading){
      await new Promise(resolve => {setTimeout(resolve,100)})
    }
    await productStore.getProducts(searchWord.value,actualShop.value);
  }

  const filterProductByShop = async (shopId?:number)=>{
    if (shopId){
      if(searchWord.value){
        await productStore.getProducts(searchWord.value,shopId);
      }else {
        await productStore.getProducts(undefined,shopId);
      }
      actualShop.value=shopId;
    }else{
      if(searchWord.value){
        await productStore.getProducts(searchWord.value);
      }else{
        await productStore.getProducts();
      }
      actualShop.value=undefined;
    }
  }

  const filterProductBySearchTerm = async (searchTerm?:string) =>{
    if (searchTerm){
      if (actualShop.value){
        await productStore.getProducts(searchTerm,actualShop.value);
      }else{
        await productStore.getProducts(searchTerm);
      }
      searchWord.value = searchTerm;
    }else {
      if (actualShop.value){
        await productStore.getProducts(undefined,actualShop.value);
      }else{
        await productStore.getProducts();
      }
      searchWord.value = undefined;
    }
  }

  const loadMore = async () => {
    let search: string | undefined;
    let shopId: number | undefined;

    if (searchWord.value) {
      search = searchWord.value as string;
    }

    if (actualShop.value) {
      shopId = Number(actualShop.value);
    }

    await productStore.getProducts(search, shopId, page.value++);

    page.value += 1;
  };


  onMounted(async ()=>{
     await getProducts();
     if (productStore.products){
       products.value= productStore.products;
     }
    initFlowbite();
  });

  watch(()=>productStore.products, (newProducts)=>{
    if (newProducts){
      products.value=newProducts;
    }
  })
</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="flex justify-between w-full">
      <search-bar-component @search="searchTerm => filterProductBySearchTerm(searchTerm)" @reset-search-filter="filterProductBySearchTerm"/>
      <div class="flex items-center justify-between">
        <create-button route-name="create-product"/>
        <shop-filter-component @change-shop="shopId => filterProductByShop(shopId)" @reset-shop-filter="filterProductByShop()"/>
      </div>

    </div>
    <product-table v-if="products" :products="products" @load-more="loadMore" @product-delete="getProducts"/>
    <p v-else>Aucun produits</p>
  </div>
</template>

<style scoped>

</style>
