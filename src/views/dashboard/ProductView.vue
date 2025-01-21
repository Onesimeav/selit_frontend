<script setup lang="ts">
  import { onMounted } from 'vue'
  import { initFlowbite } from 'flowbite'

  onMounted(initFlowbite);
</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
