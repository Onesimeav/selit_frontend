<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'

const props = defineProps<{
  count?:number,
}>()
const emit = defineEmits<{
  (event:'inputValue', value: number):number;
}>()
const inputValue = ref<number>(props.count??1)
const incrementValue = () => { inputValue.value++;
  emit('inputValue', inputValue.value); }
const decrementValue = () => {
  if (inputValue.value > 1) { inputValue.value--;
    emit('inputValue', inputValue.value); }
}

onMounted(()=>{
  initFlowbite();
})
</script>

<template>
  <form class="max-w-xs mx-3.5">
    <div class="relative flex items-center">
      <button  type="button" @click="decrementValue" class="flex-shrink-0 bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-500 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
        <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
        </svg>
      </button>
      <input type="text" id="counter-input" data-input-counter data-input-counter-min="1" class="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-heading-3 font-rubik font-normal focus:outline-none focus:ring-0 max-w-[6.5rem] mx-1.5 text-center" placeholder="" :value="inputValue" required />
      <button  type="button" @click="incrementValue" class="flex-shrink-0 bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-500 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
        <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
        </svg>
      </button>

    </div>
  </form>
</template>

<style scoped>

</style>
