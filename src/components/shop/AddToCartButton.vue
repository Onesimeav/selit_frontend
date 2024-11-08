<script setup lang="ts">
  const emit = defineEmits<{
    (event:'addToCart'):void;
  }>()
</script>

<template>
  <div class="flex justify-center items-center">
    <button @click="emit('addToCart')" type="button" class=" w-11/12 py-5 text-white font-rubik font-semibold text-heading-3 border-none shadow-gray-800 shadow-md bg-appBlack hover:bg-black focus:outline-none rounded-lg px-5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
      Ajouter au panier
    </button>
  </div>

</template>

<style scoped>

</style>
