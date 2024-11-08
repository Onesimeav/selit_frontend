<script setup lang="ts">
import type { Media } from '@/models/media'
import { onMounted } from 'vue'
import { initCarousels } from 'flowbite'
const props = defineProps<{ media: Media[] }>()
console.log(props.media);
onMounted(()=>{
  initCarousels();
})
</script>

<template>
  <div v-if="props.media.length > 0">
    <div id="default-carousel" class="relative w-full" data-carousel="static">
      <!-- Carousel wrapper -->
      <div class="relative overflow-hidden h-[40vh] md:h-96">
        <!-- Items -->
        <div v-for="(media, index) in props.media" :key="index" :class="(index === 0 ? 'block' : 'hidden') + ' overflow-hidden duration-700 ease-in-out'" data-carousel-item>
          <div v-if="media.type === 'image'">
            <img :src="media.url" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
          <div v-if="media.type === 'video'">
            <div class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <video controls>
                <source :src="media.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      <div v-if="props.media.length > 1">
        <!-- Slider indicators -->
        <div class="absolute z-50 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          <button v-for="(media, index) in props.media" :key="index" :aria-label="'Slide ' + (index + 1)" data-carousel-slide-to="index" type="button" class="w-3 h-3 rounded-full" :aria-current="index === 0 ? 'true' : 'false'"></button>
        </div>
        <!-- Slider controls -->
        <button type="button" class="absolute top-1/3 start-0 z-30 flex items-center justify-center px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
          </span>
        </button>
        <button type="button" class="absolute top-1/3 end-0 z-30 flex items-center justify-center px-4 cursor-pointer group focus:outline-none" data-carousel-next>
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
