<script setup lang="ts">
import { onMounted } from 'vue'
import { initAccordions } from 'flowbite'
import type { Specification } from '@/models/specification'

const props = defineProps<{
  specifications:Specification[];
}>()

onMounted(()=>{
  initAccordions();
})
</script>

<template>

  <div id="accordion-collapse" data-accordion="collapse" class="mx-2.5 my-4">
    <h2 id="accordion-collapse-heading-1">
      <button type="button" class="flex items-center shadow-md justify-between w-full p-5 font-medium rtl:text-right text-black border border-gray-200  focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
        <span>Détails</span>
        <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
        </svg>
      </button>
    </h2>
    <div id="accordion-collapse-body-1" class="hidden" aria-labelledby="accordion-collapse-heading-1">
      <div class="p-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <div class="relative overflow-x-auto sm:rounded-lg">
          <table v-if="props.specifications.length>0" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <tbody>
            <tr v-for="(specification,index) in props.specifications" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{specification.name}}
              </th>
              <td class="px-6 py-4">
                {{specification.value}}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </div>

</template>

<style scoped>

</style>
