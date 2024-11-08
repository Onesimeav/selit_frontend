<script setup lang="ts">

import CartComponent from '@/components/shop/CartComponent.vue'
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
onMounted(()=>{
  initFlowbite()
})
</script>

<template>
<CartComponent/>
</template>

<style scoped>

</style>
