<script setup lang="ts">

import DeliveryDetailsComponent from '@/components/shop/DeliveryDetailsComponent.vue'
</script>

<template>
  <delivery-details-component :order-reference="String($route.params.orderReference) "/>
</template>

<style scoped>

</style>
