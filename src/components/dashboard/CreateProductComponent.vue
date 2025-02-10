<script setup lang="ts">

import PreviousPageButton from '@/components/shop/PreviousPageButton.vue'
import { nextTick, onMounted, ref } from 'vue'
import { initFlowbite } from 'flowbite'
import {Carousel} from 'flowbite'
import type { CarouselItem, CarouselOptions, CarouselInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import type { CreateProduct } from '@/requests/create-product'
import { useDashboardProductStore } from '@/stores/dashboard/product'
import { useRouter } from 'vue-router'

const startCarousel = ref(false);
const specificationContainers = ref([{id:1, name:'', value:''}]);
const productStore = useDashboardProductStore();
const router = useRouter();
const productInfos=ref<{
  name: string,
  description: string,
  price: number | null,
  images: File[] | null,
  videos: File[] | null,
  specifications: string[]
}>({
  name:'',
  description:'',
  price:null,
  images:null,
  videos:null,
  specifications:[],
})

  const handleMediaChange = ()=>{
    startCarousel.value = true;
    arrangeFiles();
    nextTick(()=>{
      previewMedias()
    })
  }

const setSpecification = (container:{id:number,name:string,value:string})=>{
    productInfos.value.specifications[container.name]=container.value;
}

  const createProducts= async ()=>{
    if (productInfos.value.name && productInfos.value.description && productInfos.value.price && productInfos.value.specifications && productInfos.value.images){
      const product:CreateProduct = {
        name:productInfos.value.name,
        description:productInfos.value.description,
        price:productInfos.value.price,
        specification:productInfos.value.specifications,
        images:productInfos.value.images,
      };
      if (productInfos.value.videos){
        product.videos=productInfos.value.videos
      }
      if (await productStore.createProduct(product)){
        await router.push('/product');
      }else{
        console.log("Echec de l'opération, veuillez réessayer")
      }
    }else{
      console.log('Une erreur est survenue')
    }
  }

const arrangeFiles = ()=>{
  const fileInput = document.getElementById('medias') as HTMLInputElement;
  if (fileInput){
    const files = fileInput.files;
    const images = [];
    const videos = [];
    if (files){
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.split('/')[0]==='image'){
          images.push(files[i])
        }else {
          videos.push(files[i])
        }
      }
      productInfos.value.images=images;
      productInfos.value.videos=videos;
    }else{
      console.log('Une erreur est survenue');
    }
  }else {
    console.log('Une erreur est survenue');
  }
}

const previewMedias = () => {
  const fileInput = document.getElementById('medias') as HTMLInputElement;
  if (fileInput) {
    const files = fileInput.files;
    const carouselWrapper = document.getElementById('carousel-wrapper');
    const carouselIndicators = document.getElementById('carousel-indicators');

    if (carouselIndicators && carouselWrapper && files) {
      carouselWrapper.innerHTML = '';
      carouselIndicators.innerHTML = '';
      const slides: HTMLElement[] = [];
      const fileReadPromises: Promise<void>[] = [];
      const items: CarouselItem[] = [];
      const indicators: { position: number, el: HTMLElement }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type.split('/')[0];
        const reader = new FileReader();
        const fileReadPromise = new Promise<void>((resolve) => {
          reader.onload = function (e) {
            const slideIndex = Math.floor(i / 3); // 3 files per slide
            if (!slides[slideIndex]) {
              const newSlide = document.createElement('div');
              newSlide.className = 'hidden duration-700 ease-in-out';
              newSlide.setAttribute('data-carousel-item', '');
              slides.push(newSlide);

              // Create carousel item object for Flowbite
              items.push({ position: slideIndex, el: newSlide });

              // Create and add indicator
              const indicator = document.createElement('button');
              indicator.type = 'button';
              indicator.className = 'w-3 h-3 rounded-full';
              indicator.setAttribute('aria-current', slideIndex === 0 ? 'true' : 'false');
              indicator.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
              indicator.setAttribute('data-carousel-slide-to', String(slideIndex));
              indicators.push({ position: slideIndex, el: indicator });
              carouselIndicators.appendChild(indicator);
            }
            const itemContainer = document.createElement('div');
            itemContainer.className = 'inline-block w-1/3';

            if (fileType === 'image') {
              const img = document.createElement('img');
              if (e.target) {
                img.src = e.target.result as string;
              }
              img.className = 'w-full h-auto rounded-lg mx-1';
              itemContainer.appendChild(img);
            } else if (fileType === 'video') {
              const video = document.createElement('video');
              if (e.target) {
                video.src = e.target.result as string;
              }
              video.controls = false;
              video.className = 'w-full h-auto rounded-lg mx-1';
              itemContainer.appendChild(video);
            }
            slides[slideIndex].appendChild(itemContainer);
            resolve();
          };
          reader.readAsDataURL(file);
        });
        fileReadPromises.push(fileReadPromise);
      }

      Promise.all(fileReadPromises).then(() => {
        slides.forEach((slide) => {
          carouselWrapper.appendChild(slide);
        });

        // Reinitialize the carousel after adding the slides
        const carouselElement = document.querySelector('#default-carousel') as HTMLElement;
        if (carouselElement) {
          const options: CarouselOptions = {
            defaultPosition: 0,
            interval: 3000,
            indicators: {
              activeClasses: 'bg-white dark:bg-gray-800',
              inactiveClasses: 'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
              items: indicators,
            },
          };
          const instanceOptions: InstanceOptions = {
            id: 'default-carousel',
            override: true,
          };
          const carousel: CarouselInterface = new Carousel(carouselElement, items, options, instanceOptions);

          // Bind the next and previous buttons
          document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => carousel.prev());
          document.querySelector('[data-carousel-next]')?.addEventListener('click', () => carousel.next());
        }
      });
    } else {
      console.log('Une erreur est survenue');
      startCarousel.value = false;
    }
  } else {
    console.log('Une erreur est survenue lors de téléversement');
    startCarousel.value = false;
  }
};

const createSpecificationInput = ()=>{
  specificationContainers.value.push({id:specificationContainers.value.length+1,name:"",value:""})
}

const removeSpecificationInput =(id:number)=>{
  const container = specificationContainers.value.find(container => container.id===id);
  if(container){
    delete productInfos.value.specifications[container.name];
  }
 specificationContainers.value=specificationContainers.value.filter(container => container.id!=id);
}

/*
* TODO : Create a WYSIWWIG component to replace the description input,
*/
onMounted(initFlowbite)

</script>

<template>
  <div class="p-4 mt-24 sm:ml-64">
    <div class="grid grid-cols-8 items-center mx-4 mb-8">
      <div class="col-span-2">
        <PreviousPageButton/>
      </div>
      <div class="col-span-6 justify-center">
        <p class="font-poppins font-bold text-heading-2">Créer un produit</p>
      </div>
    </div>

    <div class="sm:w-full">
      <form class="w-full" @submit.prevent="createProducts">
        <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Détails du produit</p>
        <div class="mb-5">
          <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
          <input type="text" id="name" v-model="productInfos.name" class="w-full lg:w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="La paire de futur" required />
        </div>
        <div class=" justify-around items-center  grid grid-cols-8 mb-5">
          <label for="price" class=" col-span-2 lg:col-span-1 justify-end block text-sm font-medium text-gray-900 dark:text-white">Prix</label>
          <input type="number" v-model="productInfos.price" id="price" class=" col-span-4 lg:col-span-2 w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="20000" required />
          <p class="col-span-1 lg:col-span-2 font-poppins font-semibold text-appGray text-heading-3 mx-4">XOF</p>
        </div>
        <div class="mb-5">
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea id="description" v-model="productInfos.description" rows="4" class="block p-2.5 w-full lg:w-3/5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>

        <p class="justify-center font-poppins font-semibold text-heading-3 mb-3">Media</p>

        <div class="flex items-center justify-center w-full lg:w-3/5 mb-5">
          <label for="medias" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Cliquer pour téléverser</span> ou glisser déposer</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF, MP4, or AVI (MAX. 800x400px)</p>
            </div>
            <input id="medias" type="file" class="hidden" accept="image/*,video/*" multiple @change="handleMediaChange" />
          </label>
        </div>
        <div v-if="startCarousel" id="default-carousel" class="relative overflow-hidden w-full lg:w-4/5 h-20 lg:h-60 mb-5" data-carousel="slide">
          <!-- Carousel wrapper -->
          <div id="carousel-wrapper" class="relative rounded-lg">
            <!-- Carousel items will be dynamically added here -->
          </div>
          <!-- Slider indicators will be dynamically added here -->
          <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse" id="carousel-indicators"></div>
          <!-- Slider controls -->
          <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-appGray dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
          </button>
          <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-appGray dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
          </button>
        </div>

        <div class="flex items-center mb-3">
          <p class="justify-center font-poppins font-semibold text-heading-3 mr-6">Caractéristiques</p>
          <button type="button" @click="createSpecificationInput" class=" flex items-center justify-around text-white bg-appBlue hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">
            <svg class="w-5 h-5 text-white dark:text-white mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
            </svg>
            Ajouter
          </button>
        </div>

        <div id="specification-container" class="mb-5 w-full justify-center lg:w-1/3">
          <div v-for="container in specificationContainers" :key="container.id" :id="'specification-container-'+ container.id" class="flex items-center mb-2">
            <label :for="'specification-'+ container.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" v-model="container.name" :id="'specification-'+ container.id" class=" mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nom" required />
            <label :for="'specification-value-'+container.id" class="block text-sm font-medium text-gray-900 dark:text-white"></label>
            <input type="text" v-model="container.value" @input="setSpecification(container)" :id="'specification-value-' + container.id" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Valeur" required />
            <button v-if="container.id!==1" type="button" @click="removeSpecificationInput(container.id)">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class=" self-center w-1/5 bg-appBlue border-none font-poppins font-medium text-heading-3 text-white rounded-lg px-14 py-2 m-8 hover:border-none ">Créer le produit</button>
      </form>
    </div>

  </div>

</template>

<style scoped>

</style>
