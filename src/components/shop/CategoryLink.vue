<script setup lang="ts">
import { useRouter } from 'vue-router'

const props =  defineProps<{
  categoryName: string,
  categoryId:number,
}>()
const router = useRouter();
const redirectToCategoryPage = ()=>{
  router.push({
    name:'category',
    params:{
      name:props.categoryName,
      id:props.categoryId,
    }
  })
}
</script>

<template>
  <div class="flex justify-between mx-2.5">
    <p class="text-black font-rubik font-semibold text-heading-2">{{props.categoryName}}</p>
    <p @click="redirectToCategoryPage" class="inline-flex items-center font-rubik font-medium text-normal-text text-appBlack dark:text-blue-500 hover:underline">
        Voir plus
        <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
    </p>

  </div>
</template>

<style scoped>

</style>
