<script setup lang="ts">

import OrderDetailsComponent from '@/components/shop/OrderDetailsComponent.vue'
</script>

<template>
  <order-details-component :order-id="Number($route.params.id)"/>
</template>

<style scoped>

</style>
