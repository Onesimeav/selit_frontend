<script setup lang="ts">
  import ProductCard from '@/components/shop/ProductCard.vue'
  import { ref } from 'vue'
  import type { Product } from '@/models/product'

  const props = defineProps<{products:Product[]}>();
  const carrouselProducts = ref<Product[][]>([]);

  const sliceArray = (array:Product[]): Product[][] => {
    const result: Product[][] =[];
    for (let i=0; i<array.length; i+=3)
    {
      result.push(array.slice(i,i+3));
    }
    return result;
  };

  carrouselProducts.value=sliceArray(props.products);
</script>

<template>
  <div id="controls-carousel" class="relative w-full" data-carousel="static">
    <!-- Carousel wrapper -->
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
      <!-- Items -->
      <div v-for="(chunk,index) in carrouselProducts" :key="index" >
        <div  class="hidden overflow-hidden duration-700 ease-in-out" data-carousel-item>
          <div class="flex items-center">
            <div v-for="(product,i) in chunk" :key="i">
              <ProductCard  :product="product" class="w-full"/>
            </div>
          </div>

        </div>
      </div>

    </div>
    <!-- Slider controls -->
    <button type="button" class=" border-none shadow absolute top-1/4 start-0 z-30 flex items-center justify-center  px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:outline-none">
            <svg class="w-4 h-4 text-appBlack dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" class="border-none shadow absolute top-1/4 end-0 z-30 flex items-center justify-center px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:outline-none">
            <svg class="w-4 h-4 text-appBlack dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
    </button>
  </div>

</template>

<style scoped>

</style>
