<script setup lang="ts">

import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
import ProductComponent from '@/components/shop/ProductComponent.vue'

onMounted(()=>{
  initFlowbite();
})
</script>

<template>
<ProductComponent :id="Number($route.params.id)"/>
</template>

<style scoped>

</style>
