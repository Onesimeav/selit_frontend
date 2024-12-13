<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { initFlowbite } from 'flowbite'
import ShopHeader from '@/components/shop/ShopHeader.vue'
import ProductsCarrousel from '@/components/shop/ProductsCarrousel.vue'
import CategoryLink from '@/components/shop/CategoryLink.vue'
import ProductCartButton from '@/components/shop/ProductCartButton.vue'
import ProductList from '@/components/shop/ProductList.vue'
import { useCategoryStore } from '@/stores/shop/categories'
import type { Page } from '@/models/page'
import type { Category } from '@/models/category'
import type { Product } from '@/models/product'

const categoryStore = useCategoryStore();
const categories = ref<Page<Category>|null>(null);
const searchResult = ref<Page<Product>>();
const isSearching = ref(false)
const getCategoryProducts = async () => {
  if (categories.value) {
    for (let i = 0; i < categories.value?.data.length; i++) {
      categories.value.data[i].products = await categoryStore.getCategoryProduct(categories.value.data[i].id)
    }
  }
}
onMounted( ()=>{
  categories.value = categoryStore.categories;
  getCategoryProducts();

  watch(()=>categoryStore.categories, (newCategories)=>{
    categories.value=newCategories;
    getCategoryProducts();
  })
  initFlowbite()
})
</script>

<template>
  <ShopHeader @search-result="result => {searchResult=result; isSearching = true}" @search-end="() =>{isSearching=false}"/>
  <div v-if="!isSearching">
    <div v-for="category in categories?.data" :key="category.id">
      <div v-if="category.products?.total!==0" :class="{'hidden':category.products?.total===0}">
        <CategoryLink :category-name="category.name" :category-id="category.id" class="mt-3"/>
        <div v-if="category.products">
          <ProductsCarrousel :products="category.products.data"/>
        </div>
      </div>
    </div>
    <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Tout les produits</p>
    <ProductList/>
  </div>
  <div v-if="isSearching">
    <p class="text-black font-rubik font-semibold text-heading-2 mx-2.5">Resultat de recherche</p>
    <ProductList :searchResult="searchResult"/>
  </div>

  <ProductCartButton/>
</template>
